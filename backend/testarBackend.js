const axios = require('axios');

const baseURL = 'http://localhost:3000';

const cliente = {
  nome: 'Lando',
  email: 'lando@rebeldes.com',
  senha: 'forca123'
};

const pedido = {
  laranja: 2,
  uva: 1,
  abacaxi: 0
};

let token = '';

// 1️⃣ Cadastrar cliente
async function cadastrarCliente() {
  try {
    const res = await axios.post(`${baseURL}/cliente/cadastrar`, cliente);
    console.log('✅ Cliente cadastrado:', res.data.mensagem);
  } catch (err) {
    if (err.response) {
      console.error('⚠️ Erro no cadastro:', {
        status: err.response.status,
        data: err.response.data
      });
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
      console.error('⚠️ Erro no login:', {
        status: err.response.status,
        data: err.response.data
      });
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
    console.log('🧃 Pedido criado:', res.data.mensagem);
  } catch (err) {
    if (err.response) {
      console.error('⚠️ Erro ao criar pedido:', {
        status: err.response.status,
        data: err.response.data
      });
    } else {
      console.error('⚠️ Erro inesperado ao criar pedido:', err.message);
    }
  }
}

// 4️⃣ Listar pedidos
async function listarPedidos() {
  try {
    const res = await axios.get(`${baseURL}/pedido`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('📋 Pedidos encontrados:', res.data.pedidos);
  } catch (err) {
    if (err.response) {
      console.error('⚠️ Erro ao listar pedidos:', {
        status: err.response.status,
        data: err.response.data
      });
    } else {
      console.error('⚠️ Erro inesperado ao listar pedidos:', err.message);
    }
  }
}

// 🚀 Executa os testes em sequência
async function testarTudo() {
  await cadastrarCliente();
  await loginCliente();
  await criarPedido();
  await listarPedidos();
}

testarTudo();
