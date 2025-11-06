require('dotenv').config()

const API_URL = 'http://localhost:3000'

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
    })
    const loginAdmin = await loginAdminResp.json()
    console.log("👑 Login admin:", loginAdmin)

    const tokenAdmin = loginAdmin.token
    if (!tokenAdmin) {
      console.error("❌ Não foi possível obter token admin")
      return
    }

    // 2. Cadastrar cliente normal
    const cadastroResp = await fetch(`${API_URL}/cliente/cadastrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: "Teste Usuário",
        email: `teste${Date.now()}@email.com`,
        senha: "123456"
      })
    })
    const cadastro = await cadastroResp.json()
    console.log("🆕 Cadastro:", cadastro)

    // 3. Login do cliente
    const loginResp = await fetch(`${API_URL}/cliente/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cadastro.cliente.email,
        senha: "123456"
      })
    })
    const login = await loginResp.json()
    console.log("🔑 Login cliente:", login)

    const tokenCliente = login.token

    // 4. Listar produtos
    const produtosResp = await fetch(`${API_URL}/produto`)
    const produtos = await produtosResp.json()
    console.log("🛍️ Produtos:", produtos)

    const primeiroProduto = produtos.produtos[0]
    if (!primeiroProduto) {
      console.error("❌ Nenhum produto encontrado para criar pedido")
      return
    }

    // 5. Criar pedido
    const pedidoResp = await fetch(`${API_URL}/pedido`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenCliente}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itens: [{ produtoId: primeiroProduto.id, quantidade: 1 }] // usa id numérico
      })
    })
    const pedido = await pedidoResp.json()
    console.log("📦 Pedido criado:", pedido)

    const pedidoId = pedido.pedido?._id
    if (!pedidoId) {
      console.error("❌ Pedido não foi criado corretamente")
      return
    }

    // 6. Listar pedidos do cliente
    const meusPedidosResp = await fetch(`${API_URL}/pedido`, {
      headers: { 'Authorization': `Bearer ${tokenCliente}` }
    })
    const meusPedidos = await meusPedidosResp.json()
    console.log("📋 Meus pedidos:", meusPedidos)

    // 7. Admin antecipa pedido
    const anteciparResp = await fetch(`${API_URL}/pedido/admin/antecipar/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    })
    const antecipado = await anteciparResp.json()
    console.log("⏩ Pedido antecipado:", antecipado)

    // 8. Admin gera balancete
    const balanceteResp = await fetch(`${API_URL}/pedido/admin/balancete?periodo=diario`, {
      headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    })
    const balancete = await balanceteResp.json()
    console.log("💰 Balancete:", balancete)

  } catch (erro) {
    console.error("❌ Erro no fluxo de testes:", erro)
  }
}

testarFluxo()
