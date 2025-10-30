const axios = require('axios');
const baseURL = 'http://localhost:3000';

// Dados do cliente
const cliente = {
  nome: 'Lando',
  email: `lando${Date.now()}@rebeldes.com`,
  senha: 'forca123'
};

// Pedido padrão
const pedido = {
  laranja: 2,
  uva: 1,
  abacaxi: 0
};

let token = '';
let ultimoPedidoId = '';
let codigoCliente = 0;

// 🧑‍🚀 Cadastro e login do cliente
async function cadastrarCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/cadastrar`, cliente);
    codigoCliente = res.data?.codigo ?? 0;
    console.log('✅ Cliente cadastrado:', res.data);
  } catch (err) {
    console.error('⚠️ Erro no cadastro:', err.response?.data || err.message);
  }
}

async function loginCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/login`, {
      email: cliente.email,
      senha: cliente.senha
    });
    token = res.data.token;
    console.log('🔐 Login cliente bem-sucedido.');
  } catch (err) {
    console.error('⚠️ Erro no login cliente:', err.response?.data || err.message);
  }
}

// 🧃 Pedido e histórico
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

async function listarPedidos() {
  try {
    const res = await axios.get(`${baseURL}/pedido`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('📋 Pedidos do cliente:', res.data.pedidos);
  } catch (err) {
    console.error('⚠️ Erro ao listar pedidos:', err.response?.data || err.message);
  }
}

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

// 🛡️ Ações administrativas
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

async function anteciparPedido(adminToken) {
  try {
    const res = await axios.post(`${baseURL}/pedido/antecipar/${ultimoPedidoId}`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('⏩ Pedido antecipado:', res.data);
  } catch (err) {
    console.error('⚠️ Erro ao antecipar pedido:', err.response?.data || err.message);
  }
}

async function excluirPedidosClienteAdmin(adminToken) {
  try {
    const res = await axios.delete(`${baseURL}/pedido/admin/pedidos/cliente/${codigoCliente}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`🗑️ Pedidos do cliente ${codigoCliente} excluídos:`, res.data);
  } catch (err) {
    console.error('⚠️ Erro ao excluir pedidos do cliente:', err.response?.data || err.message);
  }
}

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

async function testarQuantidadesPedido() {
  const pedidoTeste = {
    laranja: 2,
    uva: 1,
    abacaxi: 1
  };

  try {
    const res = await axios.post(`${baseURL}/pedido`, pedidoTeste, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const pedidoCriado = res.data.pedido;
    console.log('🧪 Pedido criado para teste de quantidades:', pedidoCriado);

    const { laranja, uva, abacaxi } = pedidoCriado;
    if (laranja === 2 && uva === 1 && abacaxi === 1) {
      console.log('✅ Quantidades registradas corretamente.');
    } else {
      console.error('❌ Quantidades incorretas:', { laranja, uva, abacaxi });
    }
  } catch (err) {
    console.error('⚠️ Erro ao testar quantidades:', err.response?.data || err.message);
  }
}


// 🚀 Executa tudo em sequência
async function testarTudo() {
  await cadastrarCliente();
  await loginCliente();
  await criarPedido();
  await listarPedidos();
  await cancelarPedido();
  await historicoPedidos();

  const adminToken = await loginAdmin();
  if (!adminToken) return;

  await listarTodosPedidosAdmin(adminToken);
  await anteciparPedido(adminToken);
  await excluirPedidosClienteAdmin(adminToken);
  await limparPedidos(adminToken);
  await testarQuantidadesPedido();
}

testarTudo();
