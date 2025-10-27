const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');

// 📦 Cadastrar novo pedido
const cadastrarPedido = async (req, res) => {
  try {
    const clienteId = req.cliente.id; // vem do token
    const { laranja = 0, uva = 0, abacaxi = 0 } = req.body;

    const l = parseInt(laranja);
    const u = parseInt(uva);
    const a = parseInt(abacaxi);

    const total = l + u + a;

    // ✅ Regra de negócio: entre 1 e 3 unidades por pedido
    if (total < 1 || total > 3) {
      return res.status(400).json({ mensagem: 'Você deve pedir entre 1 e 3 sucos por pedido.' });
    }

    const novoPedido = new Pedido({
      clienteId,
      laranja: l,
      uva: u,
      abacaxi: a
    });

    await novoPedido.save();

    res.status(201).json({
      mensagem: 'Pedido cadastrado com sucesso',
      pedido: novoPedido
    });
  } catch (err) {
    console.error('Erro ao cadastrar pedido:', err.message);
    res.status(500).json({ mensagem: 'Erro ao cadastrar pedido' });
  }
};

// 📋 Listar pedidos do cliente
const listarPedidos = async (req, res) => {
  try {
    const clienteId = req.cliente.id;
    const { sabor, data } = req.query;

    const filtro = { clienteId };

    if (sabor && ['laranja', 'uva', 'abacaxi'].includes(sabor)) {
      filtro[sabor] = { $gt: 0 };
    }

    if (data) {
      const inicio = new Date(data);
      const fim = new Date(data);
      fim.setDate(fim.getDate() + 1);
      filtro.data = { $gte: inicio, $lt: fim };
    }

    const pedidos = await Pedido.find(filtro)
      .populate('clienteId', 'codigo nome email status')
      .sort({ data: -1 });

    res.status(200).json({ pedidos });
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos' });
  }
};

// ❌ Cancelar pedido (agora aceita codigo do cliente)
const cancelarPedido = async (req, res) => {
  try {
    const { codigo } = req.cliente; // vem do token
    const pedidoId = req.params.id;

    // Busca o cliente pelo código
    const cliente = await Cliente.findOne({ codigo });
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    if (pedido.clienteId.toString() !== cliente._id.toString()) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para cancelar este pedido' });
    }

    await Pedido.findByIdAndDelete(pedidoId);

    res.status(200).json({ mensagem: `Pedido do cliente ${codigo} cancelado com sucesso` });
  } catch (err) {
    console.error('Erro ao cancelar pedido:', err.message);
    res.status(500).json({ mensagem: 'Erro ao cancelar pedido' });
  }
};

// 🛠️ Listar todos os pedidos (admin)
const listarTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('clienteId', 'codigo nome email status')
      .sort({ data: -1 });

    res.status(200).json({ pedidos });
  } catch (err) {
    console.error('Erro ao buscar todos os pedidos:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar todos os pedidos' });
  }
};

// 🕓 Histórico de pedidos
const historicoPedidos = async (req, res) => {
  try {
    const { codigo } = req.cliente;

    const cliente = await Cliente.findOne({ codigo });
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const historico = await Pedido.find({ clienteId: cliente._id })
      .populate('clienteId', 'codigo nome email status')
      .sort({ data: -1 });

    res.status(200).json({ historico });
  } catch (err) {
    console.error('Erro ao buscar histórico:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar histórico' });
  }
};

// 📊 Gerar balancete (sem alteração)
const gerarBalancete = async (req, res) => {
  try {
    const { periodo } = req.query;

    const dataInicial = calcularDataInicial(periodo);
    if (!dataInicial) {
      return res.status(400).json({ mensagem: 'Período inválido. Use: diario, semanal, mensal, bimestral, trimestral, semestral ou anual.' });
    }

    const inicio = new Date(dataInicial.split('/').reverse().join('-'));

    const resumo = await Pedido.aggregate([
      { $match: { data: { $gte: inicio } } },
      {
        $group: {
          _id: null,
          laranja: { $sum: "$laranja" },
          uva: { $sum: "$uva" },
          abacaxi: { $sum: "$abacaxi" }
        }
      }
    ]);

    res.status(200).json({
      periodo,
      desde: dataInicial,
      ate: new Date().toLocaleDateString('pt-BR'),
      resumo: resumo[0] || { laranja: 0, uva: 0, abacaxi: 0 }
    });
  } catch (err) {
    console.error('Erro ao gerar balancete:', err.message);
    res.status(500).json({ mensagem: 'Erro ao gerar balancete' });
  }
};

function calcularDataInicial(periodo) {
  const hoje = new Date();
  const data = new Date(hoje);

  switch (periodo) {
    case 'diario': data.setDate(data.getDate() - 1); break;
    case 'semanal': data.setDate(data.getDate() - 7); break;
    case 'mensal': data.setMonth(data.getMonth() - 1); break;
    case 'bimestral': data.setMonth(data.getMonth() - 2); break;
    case 'trimestral': data.setMonth(data.getMonth() - 3); break;
    case 'semestral': data.setMonth(data.getMonth() - 6); break;
    case 'anual': data.setFullYear(data.getFullYear() - 1); break;
    default: return null;
  }

  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

// ❌ Excluir todos os pedidos de um cliente pelo código (somente admin)
const excluirPedidosPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Busca o cliente pelo código
    const cliente = await Cliente.findOne({ codigo });
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    // Exclui todos os pedidos vinculados a esse cliente
    const resultado = await Pedido.deleteMany({ clienteId: cliente._id });

    res.status(200).json({
      mensagem: `Todos os pedidos do cliente ${codigo} foram excluídos com sucesso`,
      pedidosExcluidos: resultado.deletedCount
    });
  } catch (err) {
    console.error('Erro ao excluir pedidos do cliente:', err.message);
    res.status(500).json({ mensagem: 'Erro ao excluir pedidos do cliente' });
  }
};

// DELETE /pedido/limpar
exports.limparPedidos = async (req, res) => {
  try {
    const resultado = await Pedido.deleteMany({});
    res.json({
      mensagem: "Todos os pedidos foram apagados",
      pedidosExcluidos: resultado.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao limpar pedidos",
      erro: err.message
    });
  }
};


module.exports = {
  cadastrarPedido,
  listarPedidos,
  cancelarPedido,
  listarTodosPedidos,
  historicoPedidos,
  gerarBalancete,
  excluirPedidosPorCodigo
};

