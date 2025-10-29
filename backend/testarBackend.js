const axios = require('axios');

const baseURL = 'http://localhost:3000';

const cliente = {
  nome: 'Lando',
  email: `lando${Date.now()}@rebeldes.com`,
  senha: 'forca123'
};

const pedido = {
  laranja: 2,
  uva: 1,
  abacaxi: 0
};

let token = '';
let ultimoPedidoId = '';

// 🧹 Função para limpar pedidos antigos (admin)
async function limparPedidos(adminToken) {
  try {
    const res = await axios.delete(`${baseURL}/pedido/limpar`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("🧹 Limpeza de pedidos:", res.data);
  } catch (err) {
    console.error("⚠️ Erro ao limpar pedidos:", err.response?.data || err.message);
  }
}

// 1️⃣ Cadastrar cliente
async function cadastrarCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/cadastrar`, cliente);
    console.log('✅ Cliente cadastrado:', res.data);
  } catch (err) {
    console.error('⚠️ Erro no cadastro:', err.response?.data || err.message);
  }
}

// 2️⃣ Fazer login
async function loginCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/login`, {
      email: cliente.email,
      senha: cliente.senha
    });
    token = res.data.token;
    console.log('🔐 Login bem-sucedido. Token recebido.');
  } catch (err) {
    console.error('⚠️ Erro no login:', err.response?.data || err.message);
  }
}

// 🔐 Login como administrador
async function loginAdmin() {
  try {
    const res = await axios.post(`${baseURL}/cliente/login`, {
      email: 'admin@admin.com',
      senha: 'admin123'
    });
    console.log('🔐 Login admin bem-sucedido.');
    return res.data.token;
  } catch (err) {
    console.error('⚠️ Erro no login admin:', err.response?.data || err.message);
    return '';
  }
}

// 3️⃣ Criar pedido
async function criarPedido() {
  try {
    const res = await axios.post(`${baseURL}/pedido`, pedido, {
      headers: { Authorization: `Bearer ${token}` }
    });
    ultimoPedidoId = res.data.pedido._id;
    console.log('🧃 Pedido criado:', res.data.pedido);
  } catch (err) {
    console.error('⚠️ Erro ao criar pedido:', err.response?.data || err.message);
  }
}

// 4️⃣ Listar pedidos do cliente
async function listarPedidos() {
  try {
    const res = await axios.get(`${baseURL}/pedido`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('📋 Pedidos encontrados:', res.data.pedidos);
  } catch (err) {
    console.error('⚠️ Erro ao listar pedidos:', err.response?.data || err.message);
  }
}

// 5️⃣ Cancelar pedido do cliente
async function cancelarPedido() {
  try {
    const res = await axios.delete(`${baseURL}/pedido/${ultimoPedidoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('❌ Pedido cancelado:', res.data);
  } catch (err) {
    console.error('⚠️ Erro ao cancelar pedido:', err.response?.data || err.message);
  }
}

// 6️⃣ Listar histórico de pedidos
async function historicoPedidos() {
  try {
    const res = await axios.get(`${baseURL}/pedido/historico`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('🕓 Histórico de pedidos:', res.data.historico);
  } catch (err) {
    console.error('⚠️ Erro no histórico:', err.response?.data || err.message);
  }
}

// 7️⃣ Admin - Listar todos os pedidos
async function listarTodosPedidosAdmin(adminToken) {
  try {
    const res = await axios.get(`${baseURL}/pedido/admin/todos`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('🛠️ Todos os pedidos (admin):', res.data.pedidos);
  } catch (err) {
    console.error('⚠️ Erro ao listar todos os pedidos:', err.response?.data || err.message);
  }
}

// 8️⃣ Admin - Excluir todos os pedidos de um cliente pelo código
async function excluirPedidosClienteAdmin(adminToken, codigo) {
  try {
    const res = await axios.delete(`${baseURL}/pedido/admin/pedidos/cliente/${codigo}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`🗑️ Pedidos do cliente ${codigo} excluídos:`, res.data);
  } catch (err) {
    console.error('⚠️ Erro ao excluir pedidos do cliente:', err.response?.data || err.message);
  }
}


// 🚀 Executa os testes em sequência
async function testarTudo() {
  await cadastrarCliente();
  await loginCliente();
  await criarPedido();
  await listarPedidos();
  await cancelarPedido();
  await historicoPedidos();

const adminToken = await loginAdmin();

  await listarTodosPedidosAdmin(adminToken);
  await excluirPedidosClienteAdmin(adminToken, 1);
  await limparPedidos(adminToken);
}

testarTudo();
