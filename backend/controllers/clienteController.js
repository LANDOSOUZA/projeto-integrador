const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/banco.db');

// 📌 Cadastro de cliente
exports.cadastrarCliente = (req, res) => {
  const { nome, email, senha, perfil = 'cliente' } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  // Verifica se o email já está cadastrado
  const verificarEmail = 'SELECT id FROM cliente WHERE email = ?';
  db.get(verificarEmail, [email], (err, existente) => {
    if (err) {
      console.error('Erro ao verificar email:', err.message);
      return res.status(500).json({ mensagem: 'Erro interno ao verificar email' });
    }

    if (existente) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    // Criptografa a senha e insere o cliente
    bcrypt.hash(senha, 10, (erro, hash) => {
      if (erro) {
        console.error('Erro ao criptografar senha:', erro.message);
        return res.status(500).json({ mensagem: 'Erro ao processar senha' });
      }

      const query = 'INSERT INTO cliente (nome, email, senha, perfil) VALUES (?, ?, ?, ?)';
      db.run(query, [nome, email, hash, perfil], (err) => {
        if (err) {
          console.error('Erro ao inserir cliente:', err.message);
          return res.status(500).json({ mensagem: 'Erro ao cadastrar cliente' });
        }

        res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso' });
      });
    });
  });
};

// 🔐 Login de cliente
exports.loginCliente = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  const query = 'SELECT * FROM cliente WHERE email = ?';
  db.get(query, [email], (err, cliente) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err.message);
      return res.status(500).json({ mensagem: 'Erro interno ao buscar cliente' });
    }

    if (!cliente) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    bcrypt.compare(senha, cliente.senha, (erro, resultado) => {
      if (erro) {
        console.error('Erro ao comparar senha:', erro.message);
        return res.status(500).json({ mensagem: 'Erro ao validar senha' });
      }

      if (!resultado) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }

      const payload = {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        perfil: cliente.perfil
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'segredo', { expiresIn: '1h' });

      res.status(200).json({
        mensagem: 'Login bem-sucedido',
        token
      });
    });
  });
};

// 📋 Listar todos os clientes cadastrados
exports.listarClientes = (req, res) => {
  const query = 'SELECT id, nome, email, perfil FROM cliente';

  db.all(query, [], (err, clientes) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao buscar clientes' });
    }

    res.status(200).json(clientes);
  });
};
