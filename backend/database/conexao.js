const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    db.run('PRAGMA foreign_keys = ON');
  }
});

// 🧱 Criar tabela de produtos
db.run(`
  CREATE TABLE IF NOT EXISTS produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    quantidade TEXT DEFAULT '500 ml'
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela produto:', err.message);
  } else {
    console.log('Tabela produto verificada/criada com sucesso');
  }
});

// 🧃 Inserir os 3 sucos iniciais
const sucosIniciais = [
  { nome: 'Laranja', preco: 12.0, quantidade: '500 ml' },
  { nome: 'Uva', preco: 12.0, quantidade: '500 ml' },
  { nome: 'Abacaxi', preco: 12.0, quantidade: '500 ml' }
];

sucosIniciais.forEach((suco) => {
  db.get(`SELECT * FROM produto WHERE nome = ?`, [suco.nome], (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO produto (nome, preco, quantidade) VALUES (?, ?, ?)`,
        [suco.nome, suco.preco, suco.quantidade],
        (err) => {
          if (err) {
            console.error(`Erro ao inserir suco ${suco.nome}:`, err.message);
          } else {
            console.log(`Suco ${suco.nome} inserido com sucesso`);
          }
        }
      );
    }
  });
});

// 🧍 Criação da tabela cliente
db.run(`
  CREATE TABLE IF NOT EXISTS cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    perfil TEXT DEFAULT 'cliente'
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela cliente:', err.message);
  } else {
    console.log('Tabela cliente verificada/criada com sucesso');
  }
});


// 🧾 Criação da tabela cliente
db.run(`
  CREATE TABLE IF NOT EXISTS cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela cliente:', err.message);
  } else {
    console.log('Tabela cliente verificada/criada com sucesso');
  }
});


// 🧾 Criação da tabela pedidos
db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    laranja INTEGER DEFAULT 0,
    uva INTEGER DEFAULT 0,
    abacaxi INTEGER DEFAULT 0,
    data TEXT,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela pedidos:', err.message);
  } else {
    console.log('Tabela pedidos verificada/criada com sucesso');
  }
});

module.exports = db;
