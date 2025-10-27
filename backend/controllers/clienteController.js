const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente');

// 📌 Cadastro de cliente
exports.cadastrarCliente = async (req, res) => {
  try {
    const { nome, email, senha, status } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    // Verifica se já existe cliente com esse email
    const existente = await Cliente.findOne({ email });
    if (existente) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const hash = await bcrypt.hash(senha, 10);

    // Cria cliente (status padrão = "USUARIO" se não informado)
    const novoCliente = new Cliente({
      nome,
      email,
      senha: hash,
      status: status || undefined
    });

    await novoCliente.save();

    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err.message);
    res.status(500).json({ mensagem: 'Erro interno ao cadastrar cliente' });
  }
};

// 🔐 Login de cliente
exports.loginCliente = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }

    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const payload = {
      id: cliente._id,
      nome: cliente.nome,
      email: cliente.email,
      status: cliente.status
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'segredo', {
      expiresIn: '1h'
    });

    res.status(200).json({
      mensagem: 'Login bem-sucedido',
      token
    });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ mensagem: 'Erro interno ao fazer login' });
  }
};

// 📋 Listar todos os clientes cadastrados
exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find({}, '-senha'); // exclui o campo senha
    res.status(200).json(clientes);
  } catch (err) {
    console.error('Erro ao buscar clientes:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar clientes' });
  }
};
