require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testarFluxo() {
  try {
    // 1. Login do admin fixo
    const loginAdminResp = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "landosouza@sucos.com",
        senha: "@L11Lando02025"
      })
    });
    console.log("👑 Login admin (status:", loginAdminResp.status, ")");
    const loginAdmin = await loginAdminResp.json();
    const tokenAdmin = loginAdmin.token;
    if (!tokenAdmin) throw new Error("Token admin não obtido");

    // 2. Cadastrar cliente normal
    const cadastroResp = await fetch(`${API_URL}/cliente/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: "Teste Usuário",
        email: `teste${Date.now()}@email.com`,
        senha: "123456"
      })
    });
    console.log("🆕 Cadastro (status:", cadastroResp.status, ")");
    const cadastro = await cadastroResp.json();
    console.log("🆕 Cadastro JSON bruto:", cadastro);

    // 3. Login do cliente
    // tenta pegar o email em diferentes formatos possíveis
    const emailCliente = cadastro.user?.email;
    console.log("📧 Email usado para login:", emailCliente);

    const loginResp = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailCliente,
        senha: "123456"
      })
    });
    console.log("🔑 Login cliente (status:", loginResp.status, ")");
    const loginRaw = await loginResp.text();
    console.log("🔑 Login cliente resposta bruta:", loginRaw);

    let login;
    try {
      login = JSON.parse(loginRaw);
    } catch {
      console.error("❌ Não foi possível converter resposta de login em JSON");
    }

    const tokenCliente = login?.token;
    if (!tokenCliente) throw new Error("Token cliente não obtido");

    // 4. Listar produtos
    const produtosResp = await fetch(`${API_URL}/produto`);
    console.log("🛍️ Produtos (status:", produtosResp.status, ")");
    const produtos = await produtosResp.json();
    const primeiroProduto = produtos.produtos[0];
    if (!primeiroProduto) throw new Error("Nenhum produto encontrado");

    // 5. Criar pedido
    const pedidoResp = await fetch(`${API_URL}/pedido`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenCliente}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itens: [{ produtoId: primeiroProduto._id, quantidade: 1 }]
      })
    });
    console.log("📦 Pedido criado (status:", pedidoResp.status, ")");
    const pedido = await pedidoResp.json();
    const pedidoId = pedido.pedido?._id;
    if (!pedidoId) throw new Error("Pedido não foi criado corretamente");

    // 6. Listar pedidos do cliente
    const meusPedidosResp = await fetch(`${API_URL}/pedido`, {
      headers: { 'Authorization': `Bearer ${tokenCliente}` }
    });
    console.log("📋 Meus pedidos (status:", meusPedidosResp.status, ")");
    const meusPedidos = await meusPedidosResp.json();

    console.log("📦 ID do pedido para antecipar:", pedidoId);

    // 7. Admin antecipa pedido
    console.log("📦 ID do pedido para antecipar:", pedidoId);

    const anteciparResp = await fetch(`${API_URL}/pedido/admin/antecipar/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });

    // sempre imprime o status da resposta
    console.log("⏩ Antecipar pedido (status:", anteciparResp.status, ")");

    if (anteciparResp.ok) {
      const antecipado = await anteciparResp.json();
      console.log("⏩ Pedido antecipado:", antecipado);
    } else {
      const erroTexto = await anteciparResp.text();
      console.error("❌ Erro ao antecipar pedido:", anteciparResp.status, erroTexto);
    }

    // 8. Admin atualiza status do pedido
    const atualizarResp = await fetch(`${API_URL}/pedido/admin/${pedidoId}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'em_processamento' })
    });
    console.log("📌 Atualizar status (status:", atualizarResp.status, ")");
    
    if (atualizarResp.ok) {
      const atualizado = await atualizarResp.json();
      console.log("📌 Pedido atualizado:", atualizado);
    } else {
      const erroTexto = await atualizarResp.text();
      console.error("❌ Erro ao atualizar status:", atualizarResp.status, erroTexto);
    }

    // 9. Admin gera balancete
    const balanceteResp = await fetch(`${API_URL}/pedido/admin/balancete?periodo=diario`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log("💰 Balancete (status:", balanceteResp.status, ")");
    const balancete = await balanceteResp.json();
    console.log("💰 Balancete:", balancete);

    // 10. Consultar status geral (CLP via OPC UA)
    const statusResp = await fetch(`${API_URL}/status`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log("📊 Status CLP (status:", statusResp.status, ")");
    const status = await statusResp.json();
    console.log("📊 Status CLP:", status);

    console.log("✅ Fluxo completo testado com sucesso!");

  } catch (erro) {
    console.error("❌ Erro no fluxo de testes:", erro.message);
  }
}

testarFluxo();
