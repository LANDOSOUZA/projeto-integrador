const Pedido = require('../models/Pedido');
const Cliente = require('../models/Cliente');

// 📦 Cadastrar novo pedido
const cadastrarPedido = async (req, res) => {

    console.log('🚀 Entrou em cadastrarPedido');
    console.log('🔐 req.user:', req.user);


  try {
    const { codigo } = req.user;
    const { laranja = 0, uva = 0, abacaxi = 0 } = req.body;

    const l = parseInt(laranja) || 0;
    const u = parseInt(uva) || 0;
    const a = parseInt(abacaxi) || 0;
    const total = l + u + a;

    if (total < 1 || total > 3) {
      return res.status(400).json({ mensagem: 'Você deve pedir entre 1 e 3 sucos por pedido.' });
    }

    const cliente = await Cliente.findOne({ codigo });
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const novoPedido = new Pedido({
      clienteId: cliente._id,
      codigoCliente: cliente.codigo,
      laranja: l,
      uva: u,
      abacaxi: a
    });

    console.log('📝 Pedido a salvar:', {
      clienteId: cliente._id,
      codigoCliente: cliente.codigo,
      laranja: l,
      uva: u,
      abacaxi: a
    });

    console.log('👤 Cliente encontrado:', cliente);



    await novoPedido.validate();

    await novoPedido.save();

    res.status(201).json({
      mensagem: 'Pedido cadastrado com sucesso',
      pedido: novoPedido
    });
  } catch (err) {
    console.error('❌ Erro ao cadastrar pedido:');
    console.error(err);

    res.status(500).json({ mensagem: 'Erro ao cadastrar pedido', erro: err.message });

  }
};

const listarPedidos = async (req, res) => {
  try {
    console.log('🔐 req.user:', req.user); // Verifica se o token está populando corretamente

    const { codigo } = req.user;
    console.log('🔎 Código do cliente:', codigo);

    const { sabor, data } = req.query;
    console.log('🔍 Query recebida:', req.query);

    const cliente = await Cliente.findOne({ codigo });
    console.log('👤 Cliente encontrado:', cliente);

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    const filtro = { clienteId: cliente._id };

    if (sabor && ['laranja', 'uva', 'abacaxi'].includes(sabor)) {
      filtro[sabor] = { $gt: 0 };
    }

    if (data) {
      const inicio = new Date(data);
      const fim = new Date(data);
      fim.setDate(fim.getDate() + 1);
      filtro.data = { $gte: inicio, $lt: fim };
    }

    console.log('📋 Filtro aplicado:', filtro);

    const pedidos = await Pedido.find(filtro)
      .populate('clienteId', 'codigo nome email status')
      .sort({ data: -1 });

    console.log('📦 Pedidos encontrados:', pedidos);

    res.status(200).json({ pedidos });
  } catch (err) {
    console.error('❌ Erro ao buscar pedidos:');
    console.error(err); // mostra o erro completo
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos', erro: err.message });
  }
};



// 🛠️ Listar todos os pedidos (admin)
const listarTodosPedidosAdmin = async (req, res) => {
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
    const { codigo } = req.user;

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

// 📊 Gerar balancete
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

// 🗑️ Excluir pedidos de um cliente
const excluirPedidosClienteAdmin = async (req, res) => {
  try {
    const { codigoCliente } = req.params;
    const resultado = await Pedido.deleteMany({ codigoCliente });
    res.status(200).json({ mensagem: 'Pedidos do cliente excluídos', resultado });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao excluir pedidos', erro: err.message });
  }
};


// ❌ Excluir todos os pedidos de um cliente pelo código (admin)
const excluirPedidosPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    const cliente = await Cliente.findOne({ codigo });
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

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

// 🧹 Limpar todos os pedidos
const limparPedidos = async (req, res) => {
  try {
    const resultado = await Pedido.deleteMany({});
    res.status(200).json({ mensagem: 'Todos os pedidos foram removidos', resultado });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao limpar pedidos', erro: err.message });
  }
};

// ❌ Cancelar pedido
const cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    // 🚫 Impede cancelar pedidos já finalizados
    if (pedido.status === 'pronto') {
      return res.status(400).json({ mensagem: 'Não é possível cancelar um pedido que já está pronto' });
    }

    // 🚫 Impede cancelar pedidos já cancelados
    if (pedido.status === 'cancelado') {
      return res.status(400).json({ mensagem: 'O pedido já está cancelado' });
    }

    pedido.status = 'cancelado';
    await pedido.save();

    res.status(200).json({ mensagem: 'Pedido cancelado com sucesso', pedido });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao cancelar pedido', erro: err.message });
  }
};


// ⏩ Antecipar pedido
const anteciparPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' });
    }

    // 🚫 Impede antecipar pedidos cancelados
    if (pedido.status === 'cancelado') {
      return res.status(400).json({ mensagem: 'Não é possível antecipar um pedido cancelado' });
    }

    // 🚫 Impede antecipar pedidos já finalizados
    if (pedido.status === 'pronto') {
      return res.status(400).json({ mensagem: 'O pedido já está pronto e não pode ser antecipado' });
    }

    // Ciclo de status
    if (pedido.status === 'iniciado') pedido.status = 'em_processamento';
    else if (pedido.status === 'em_processamento') pedido.status = 'pronto';

    await pedido.save();

    console.log(`⏩ Pedido ${pedido._id} antecipado para status: ${pedido.status}`);

    res.status(200).json({ mensagem: 'Pedido atualizado com sucesso', pedido });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar pedido', erro: err.message });
  }
};



// ✅ Exportações
module.exports = {
  cadastrarPedido,
  listarPedidos,
  cancelarPedido,
  historicoPedidos,
  gerarBalancete,
  excluirPedidosPorCodigo,
  limparPedidos,  
  anteciparPedido,
  listarTodosPedidosAdmin,
  anteciparPedido,
  excluirPedidosClienteAdmin,
};

