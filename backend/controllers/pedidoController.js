const db = require('../database/conexao');

// 📦 Cadastrar novo pedido
const cadastrarPedido = (req, res) => {
  const clienteId = req.cliente.id;
  const { laranja = 0, uva = 0, abacaxi = 0 } = req.body;

  // Garantir que os valores sejam inteiros positivos
  const l = parseInt(laranja);
  const u = parseInt(uva);
  const a = parseInt(abacaxi);

  const total = l + u + a;

  if (total < 1 || total > 3) {
  return res.status(400).json({ mensagem: 'Você deve pedir entre 1 e 3 sucos por pedido.' });
}


  // Verificar estoque atual
  db.get(`SELECT SUM(laranja) AS l, SUM(uva) AS u, SUM(abacaxi) AS a FROM pedidos`, [], (err, estoque) => {
    if (err) {
      console.error('Erro ao verificar estoque:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao verificar estoque' });
    }

    const estoqueAtual = {
      laranja: estoque?.l || 0,
      uva: estoque?.u || 0,
      abacaxi: estoque?.a || 0
    };

    if (
      estoqueAtual.laranja + l > 3 ||
      estoqueAtual.uva + u > 3 ||
      estoqueAtual.abacaxi + a > 3
    ) {
      return res.status(400).json({ mensagem: 'Estoque insuficiente para completar o pedido.' });
    }

    const data = new Date().toISOString();

    db.run(
      `INSERT INTO pedidos (cliente_id, laranja, uva, abacaxi, data) VALUES (?, ?, ?, ?, ?)`,
      [clienteId, l, u, a, data],
      function (err) {
        if (err) {
          console.error('Erro ao cadastrar pedido:', err.message);
          return res.status(500).json({ mensagem: 'Erro ao cadastrar pedido' });
        }

        return res.status(201).json({
          mensagem: 'Pedido cadastrado com sucesso',
          pedido: {
            id: this.lastID,
            cliente_id: clienteId,
            laranja: l,
            uva: u,
            abacaxi: a,
            data,
          },
        });
      }
    );
  });
};


// 📋 Listar pedidos do cliente com filtros opcionais
const listarPedidos = (req, res) => {
  const clienteId = req.cliente.id;
  const { sabor, data } = req.query;

  let query = `SELECT * FROM pedidos WHERE cliente_id = ?`;
  const params = [clienteId];

  if (sabor && ['laranja', 'uva', 'abacaxi'].includes(sabor)) {
    query += ` AND ${sabor} > 0`;
  }

  if (data) {
    query += ` AND DATE(data) = DATE(?)`;
    params.push(data);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao buscar pedidos' });
    }

    res.status(200).json({ pedidos: rows });
  });
};


// ❌ Cancelar pedido do cliente
const cancelarPedido = (req, res) => {
  const clienteId = req.cliente.id;
  const pedidoId = req.params.id;

  db.get(`SELECT * FROM pedidos WHERE id = ?`, [pedidoId], (err, pedido) => {
    if (err) {
      console.error('Erro ao buscar pedido:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao buscar pedido' });
    }

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    if (pedido.cliente_id !== clienteId) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para cancelar este pedido' });
    }

    db.run(`DELETE FROM pedidos WHERE id = ?`, [pedidoId], function (err) {
      if (err) {
        console.error('Erro ao cancelar pedido:', err.message);
        return res.status(500).json({ mensagem: 'Erro ao cancelar pedido' });
      }

      res.status(200).json({ mensagem: 'Pedido cancelado com sucesso' });
    });
  });
};

// 🛠️ Listar todos os pedidos (admin)
const listarTodosPedidos = (req, res) => {
  db.all(`SELECT * FROM pedidos`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar todos os pedidos:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao buscar todos os pedidos' });
    }

    res.status(200).json({ pedidos: rows });
  });
};

// 🕓 Histórico de pedidos do cliente
const historicoPedidos = (req, res) => {
  const clienteId = req.cliente.id;

  db.all(
    `SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY data DESC`,
    [clienteId],
    (err, rows) => {
      if (err) {
        console.error('Erro ao buscar histórico:', err.message);
        return res.status(500).json({ mensagem: 'Erro ao buscar histórico' });
      }

      res.status(200).json({ historico: rows });
    }
  );
};

const gerarBalancete = (req, res) => {
  const { periodo } = req.query;

  const dataInicial = calcularDataInicial(periodo);
  if (!dataInicial) {
    return res.status(400).json({ mensagem: 'Período inválido. Use: diario, semanal, mensal, bimestral, trimestral, semestral ou anual.' });
  }

  // Converte dataInicial para formato ISO para comparação no banco
  const partes = dataInicial.split('/');
  const dataISO = `${partes[2]}-${partes[1]}-${partes[0]}`; // AAAA-MM-DD

  const query = `
    SELECT
      SUM(laranja) AS laranja,
      SUM(uva) AS uva,
      SUM(abacaxi) AS abacaxi
    FROM pedidos
    WHERE DATE(data) >= DATE(?)
  `;

  db.get(query, [dataISO], (err, resumo) => {
    if (err) {
      console.error('Erro ao gerar balancete:', err.message);
      return res.status(500).json({ mensagem: 'Erro ao gerar balancete' });
    }

    res.status(200).json({
      periodo,
      desde: dataInicial,
      ate: new Date().toLocaleDateString('pt-BR'),
      resumo
    });
  });
};



function calcularDataInicial(periodo) {
  const hoje = new Date();
  const data = new Date(hoje); // cópia

  switch (periodo) {
    case 'diario':
      data.setDate(data.getDate() - 1);
      break;
    case 'semanal':
      data.setDate(data.getDate() - 7);
      break;
    case 'mensal':
      data.setMonth(data.getMonth() - 1);
      break;
    case 'bimestral':
      data.setMonth(data.getMonth() - 2);
      break;
    case 'trimestral':
      data.setMonth(data.getMonth() - 3);
      break;
    case 'semestral':
      data.setMonth(data.getMonth() - 6);
      break;
    case 'anual':
      data.setFullYear(data.getFullYear() - 1);
      break;
    default:
      return null;
  }

  // Retorna no formato DD/MM/AAAA
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

module.exports = {
  cadastrarPedido,
  listarPedidos,
  cancelarPedido,
  listarTodosPedidos,
  historicoPedidos,
  gerarBalancete
};
