const axios = require('axios');
const baseURL = 'http://localhost:3000';

const cliente = {
  nome: 'Lando',
  email: `lando${Date.now()}@rebeldes.com`,
  senha: 'forca123'
};

const pedidoPadrao = { laranja: 1, uva: 1, abacaxi: 1 };

let token = '';
let ultimoPedidoId = '';
let codigoCliente = 0;

// 🧑‍🚀 Cliente
async function cadastrarCliente() {
  try {
    const { data } = await axios.post(`${baseURL}/cliente/cadastrar`, cliente, {
      headers: { 'Content-Type': 'application/json' }
    });
    codigoCliente = data?.codigo ?? 0;
    console.log('✅ Cliente cadastrado:', data);
  } catch (err) {
    console.error('⚠️ Erro no cadastro:', err.response?.data || err.message);
  }
}

async function loginCliente() {
  try {
    const { data } = await axios.post(`${baseURL}/cliente/login`, {
      email: cliente.email,
      senha: cliente.senha
    }, { headers: { 'Content-Type': 'application/json' } });
    token = data?.token || '';
    console.log('🔐 Login cliente bem-sucedido. Token presente?', Boolean(token));
  } catch (err) {
    console.error('⚠️ Erro no login cliente:', err.response?.data || err.message);
  }
}

// 🧃 Pedido
async function criarPedido(pedido = pedidoPadrao) {
  try {
    const { data } = await axios.post(`${baseURL}/pedido`, pedido, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!data?.pedido?._id) {
      console.error('⚠️ Backend respondeu sem _id de pedido:', data);
      return;
    }

    ultimoPedidoId = data.pedido._id;
    console.log('🧃 Pedido criado:', data.pedido);
  } catch (err) {
    console.error('⚠️ Erro ao criar pedido:', err.response?.data || err.message);
  }
}

async function listarPedidos() {
  try {
    const { data } = await axios.get(`${baseURL}/pedido`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('📋 Pedidos do cliente:', data?.pedidos || []);
  } catch (err) {
    console.error('⚠️ Erro ao listar pedidos:', err.response?.data || err.message);
  }
}

async function cancelarPedido() {
  if (!ultimoPedidoId) {
    console.log('⚠️ Nenhum pedido válido para cancelar.');
    return;
  }
  try {
    const { data } = await axios.delete(`${baseURL}/pedido/${ultimoPedidoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('❌ Pedido cancelado:', data);
  } catch (err) {
    console.error('⚠️ Erro ao cancelar pedido:', err.response?.data || err.message);
  }
}

async function historicoPedidos() {
  try {
    const { data } = await axios.get(`${baseURL}/pedido/historico`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('🕓 Histórico de pedidos:', data?.historico || []);
  } catch (err) {
    console.error('⚠️ Erro no histórico:', err.response?.data || err.message);
  }
}

// 🛡️ Admin
async function loginAdmin() {
  try {
    const { data } = await axios.post(`${baseURL}/cliente/login`, {
      email: 'admin@admin.com',
      senha: 'admin123'
    }, { headers: { 'Content-Type': 'application/json' } });
    const adminToken = data?.token || '';
    console.log('🔐 Login admin bem-sucedido. Token presente?', Boolean(adminToken));
    return adminToken;
  } catch (err) {
    console.error('⚠️ Erro no login admin:', err.response?.data || err.message);
    return '';
  }
}

// 📋 Listar todos os pedidos (admin)
async function listarTodosPedidosAdmin(adminToken) {
  try {
    const { data } = await axios.get(`${baseURL}/pedido/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('📋 Todos os pedidos (admin):', data?.pedidos || []);
  } catch (err) {
    console.error('⚠️ Erro ao listar todos pedidos admin:', err.response?.data || err.message);
  }
}

// ⏩ Antecipar pedido
async function anteciparPedido(adminToken) {
  try {
    const { data } = await axios.put(`${baseURL}/pedido/admin/antecipar/${ultimoPedidoId}`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('⏩ Pedido antecipado:', data);
  } catch (err) {
    console.error('⚠️ Erro ao antecipar pedido:', err.response?.data || err.message);
  }
}

// 🗑️ Excluir pedidos de um cliente
async function excluirPedidosClienteAdmin(adminToken) {
  try {
    const { data } = await axios.delete(`${baseURL}/pedido/admin/excluir/${codigoCliente}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('🗑️ Pedidos do cliente excluídos:', data);
  } catch (err) {
    console.error('⚠️ Erro ao excluir pedidos do cliente:', err.response?.data || err.message);
  }
}

// 🧹 Limpar todos os pedidos
async function limparPedidos(adminToken) {
  try {
    const { data } = await axios.delete(`${baseURL}/pedido/admin/limpar`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('🧹 Todos os pedidos removidos:', data);
  } catch (err) {
    console.error('⚠️ Erro ao limpar pedidos:', err.response?.data || err.message);
  }
}

// 🚀 Execução principal
async function testarTudo() {
  await cadastrarCliente();
  await loginCliente();
  await criarPedido();
  await listarPedidos();
  await cancelarPedido();
  await historicoPedidos();

  const adminToken = await loginAdmin();
  if (!adminToken) {
    console.log('⚠️ Sem token de admin, pulando rotas administrativas.');
    return;
  }

  await listarTodosPedidosAdmin(adminToken);
  await anteciparPedido(adminToken);
  await excluirPedidosClienteAdmin(adminToken);
  await limparPedidos(adminToken);
}

testarTudo();
