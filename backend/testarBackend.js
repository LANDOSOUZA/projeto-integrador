require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testarFluxo() {
  try {
    console.log("=== INÍCIO DO FLUXO DE TESTES ===");

    // 1. Login do admin fixo
    console.log("1️⃣ Iniciando login do admin...");
    const loginAdminResp = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "landosouza@sucos.com",
        senha: "@L11Lando02025"
      })
    });
    console.log("1️⃣ Login admin (status:", loginAdminResp.status, ")");
    const loginAdmin = await loginAdminResp.json();
    const tokenAdmin = loginAdmin.token;
    if (!tokenAdmin) throw new Error("Token admin não obtido");

    // 2. Cadastrar cliente normal
    console.log("2️⃣ Iniciando cadastro de cliente...");
    const cadastroResp = await fetch(`${API_URL}/cliente/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: "Teste Usuário",
        email: `teste${Date.now()}@email.com`,
        senha: "123456"
      })
    });
    console.log("2️⃣ Cadastro (status:", cadastroResp.status, ")");
    const cadastro = await cadastroResp.json();
    console.log("2️⃣ Cadastro JSON bruto:", cadastro);

    // 3. Login do cliente
    console.log("3️⃣ Iniciando login do cliente...");
    const emailCliente = cadastro.user?.email || cadastro.email;
    console.log("3️⃣ Email usado para login:", emailCliente);

    const loginResp = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailCliente,
        senha: "123456"
      })
    });
    console.log("3️⃣ Login cliente (status:", loginResp.status, ")");
    const loginRaw = await loginResp.text();
    console.log("3️⃣ Login cliente resposta bruta:", loginRaw);

    let login;
    try {
      login = JSON.parse(loginRaw);
    } catch {
      console.error("3️⃣ ❌ Não foi possível converter resposta de login em JSON");
    }

    const tokenCliente = login?.token;
    if (!tokenCliente) throw new Error("Token cliente não obtido");

    // 4. Listar produtos
    console.log("4️⃣ Listando produtos...");
    const produtosResp = await fetch(`${API_URL}/produto`);
    console.log("4️⃣ Produtos (status:", produtosResp.status, ")");
    const produtos = await produtosResp.json();
    const listaProdutos = produtos.produtos || produtos;
    const primeiroProduto = listaProdutos[0];
    if (!primeiroProduto) throw new Error("Nenhum produto encontrado");

    // 5. Criar pedido
    console.log("5️⃣ Criando pedido...");
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
    console.log("5️⃣ Pedido criado (status:", pedidoResp.status, ")");
    const pedido = await pedidoResp.json();
    const pedidoId = pedido.pedido?._id;
    if (!pedidoId) throw new Error("Pedido não foi criado corretamente");

    // 6. Listar pedidos do cliente
    console.log("6️⃣ Listando pedidos do cliente...");
    const meusPedidosResp = await fetch(`${API_URL}/pedido`, {
      headers: { 'Authorization': `Bearer ${tokenCliente}` }
    });
    console.log("6️⃣ Meus pedidos (status:", meusPedidosResp.status, ")");
    const meusPedidos = await meusPedidosResp.json();
    console.log("6️⃣ Meus pedidos:", meusPedidos);

    // 7. Admin antecipa pedido
    // 7. Admin antecipa pedido
    console.log("7️⃣ Antecipando pedido...");
    const anteciparResp = await fetch(`${API_URL}/pedido/admin/${pedidoId}/antecipar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log("7️⃣ Antecipar pedido (status:", anteciparResp.status, ")");
    if (anteciparResp.ok) {
      const antecipado = await anteciparResp.json();
      console.log("7️⃣ Pedido antecipado:", antecipado);
    } else {
      const erroTexto = await anteciparResp.text();
      console.error("7️⃣ ❌ Erro ao antecipar pedido:", anteciparResp.status, erroTexto);
    }


    // 8. Admin atualiza status do pedido
    console.log("8️⃣ Atualizando status do pedido...");
    const atualizarResp = await fetch(`${API_URL}/pedido/admin/${pedidoId}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${tokenAdmin}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'em_processamento' })
    });
    console.log("8️⃣ Atualizar status (status:", atualizarResp.status, ")");
    if (atualizarResp.ok) {
      const atualizado = await atualizarResp.json();
      console.log("8️⃣ Pedido atualizado:", atualizado);
    } else {
      const erroTexto = await atualizarResp.text();
      console.error("8️⃣ ❌ Erro ao atualizar status:", atualizarResp.status, erroTexto);
    }

    // 9. Admin gera balancete
    console.log("9️⃣ Gerando balancete...");
    const balanceteResp = await fetch(`${API_URL}/pedido/admin/balancete?periodo=diario`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log("9️⃣ Balancete (status:", balanceteResp.status, ")");
    const balancete = await balanceteResp.json();
    console.log("9️⃣ Balancete:", balancete);

    // 10. Consultar status geral (CLP via OPC UA)
    console.log("🔟 Consultando status CLP...");
    const statusResp = await fetch(`${API_URL}/status`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    console.log("🔟 Status CLP (status:", statusResp.status, ")");
    const status = await statusResp.json();
    console.log("🔟 Status CLP:", status);

    console.log("✅ Fluxo completo testado com sucesso!");

  } catch (erro) {
    console.error("❌ Erro no fluxo de testes:", erro.message);
  }
}

testarFluxo();
