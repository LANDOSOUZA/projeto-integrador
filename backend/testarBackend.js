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

// Função para limpar pedidos antigos
async function limparPedidos() {
  try {
    const resp = await fetch('http://localhost:3000/pedido/limpar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await resp.json();
    console.log("🧹 Limpeza de pedidos:", data);
  } catch (err) {
    console.error("Erro ao limpar pedidos:", err.message);
  }
}


// 1️⃣ Cadastrar cliente
async function cadastrarCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/cadastrar`, cliente);
    console.log('✅ Cliente cadastrado:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('⚠️ Erro no cadastro:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado no cadastro:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro no login:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado no login:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao criar pedido:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado ao criar pedido:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao listar pedidos:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado ao listar pedidos:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao cancelar pedido:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado ao cancelar pedido:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao buscar histórico:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado no histórico:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao listar todos os pedidos:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado ao listar todos os pedidos:', err.message);
    }
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
    if (err.response) {
      console.error('⚠️ Erro ao excluir pedidos do cliente:', err.response.data);
    } else {
      console.error('⚠️ Erro inesperado ao excluir pedidos:', err.message);
    }
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

  // ⚠️ Para testar as'rotas de admin, passe manualmente o token de um admin
  const adminToken =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmY4MzQyMWE4MDU2MWE5NTk4NGM5YyIsImNvZGlnbyI6NCwibm9tZSI6IkFkbWluaXN0cmFkb3IiLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN0YXR1cyI6ImFkbWluIiwiaWF0IjoxNzYxNTc1NzY1LCJleHAiOjE3NjE1NzkzNjV9.5nsbbLp4VNNtACXinQb2xe-ykM4uC2dZhNZAWu3RNhc"
  await listarTodosPedidosAdmin(adminToken);
  await excluirPedidosClienteAdmin(adminToken, 1); // exemplo: excluir pedidos do cliente código 1
}

testarTudo();
