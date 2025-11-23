// 📂 src/controllers/pedidoController.js
const Pedido = require('../models/Pedido')
const Cliente = require('../models/Cliente')
const Counter = require('../models/Counter')
const pedidoService = require('../services/pedidoService')
const relatorioService = require('../services/relatorioService')
const mesService = require('../services/mesService')
const OpcuaService = require('../services/opcuaService')

// 🔖 Status padronizados
const STATUS = {
  INICIADO: 'iniciado',
  EM_PROCESSAMENTO: 'em_processamento',
  PRONTO: 'pronto',
  CANCELADO: 'cancelado',
  PROCESSANDO: 'processando'
}
const STATUS_PERMITIDOS = Object.values(STATUS)

// 🔢 Gerar ordem sequencial usando Counter
async function gerarOrdemPedido() {
  const counter = await Counter.findOneAndUpdate(
    { nome: 'pedido' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )
  return counter.seq
}

// 📦 Cadastrar pedido (cliente logado)
const cadastrarPedido = async (req, res) => {
  try {
    const { itens } = req.body
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ mensagem: 'O pedido deve conter pelo menos 1 item' })
    }

    if (!req.user?.codigo) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' })
    }

    const cliente = await Cliente.findOne({ codigo: req.user.codigo })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    // Limite de 3 pedidos ativos por cliente
    const pedidosAtivos = await Pedido.countDocuments({
      clienteId: cliente._id,
      status: { $in: [STATUS.INICIADO, STATUS.EM_PROCESSAMENTO] }
    })
    if (pedidosAtivos >= 3) {
      return res.status(400).json({ mensagem: 'Limite de 3 pedidos ativos atingido' })
    }

    // Validação de quantidade total
    const total = itens.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0)
    if (total < 1 || total > 3) {
      return res.status(400).json({ mensagem: 'O pedido deve ter entre 1 e 3 sucos' })
    }

    // Validação de combinações
    const contagem = {}
    for (const item of itens) {
      const q = Number(item.quantidade) || 0
      if (q < 1) {
        return res.status(400).json({ mensagem: 'Quantidade inválida' })
      }
      contagem[item.produtoId] = (contagem[item.produtoId] || 0) + q
    }
    if (!pedidoService.validarCombinacao(contagem)) {
      return res.status(400).json({ mensagem: 'Combinação de sucos inválida' })
    }

    console.log('REQ BODY:', req.body)

    // 🔄 Converter itens para garantir que só o _id seja salvo
    const itensConvertidos = itens.map(i => ({
      produtoId: i.produtoId?._id || i.produtoId, // só o ID
      quantidade: i.quantidade
    }))

    const ordem = await gerarOrdemPedido()
    console.log('Ordem gerada:', ordem)

    const novoPedido = new Pedido({
      clienteId: cliente._id,
      codigoCliente: cliente.codigo,
      itens: itensConvertidos,
      status: STATUS.INICIADO,
      data: new Date(),
      ordem
    })

    await novoPedido.save()
    console.log('Pedido salvo:', novoPedido)

    const pedidoPopulado = await novoPedido.populate([
      { path: 'clienteId', select: 'codigo nome email status' },
      { path: 'itens.produtoId', select: 'codigo nome preco status' }
    ])

    res.status(201).json({
      mensagem: 'Pedido cadastrado com sucesso',
      pedido: pedidoPopulado.toObject()
    })
  } catch (err) {
    console.error('❌ Erro ao cadastrar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar pedido', erro: err.message })
  }
}

// ⏩ Antecipar pedido na fila (Admin)
const anteciparPedido = async (req, res) => {
  try {
    const { passos = 1 } = req.body
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado' })

    if ([STATUS.CANCELADO, STATUS.PRONTO].includes(pedido.status)) {
      return res.status(400).json({ mensagem: 'Não é possível antecipar este pedido' })
    }

    pedido.ordem = Math.max(1, pedido.ordem - passos)
    await pedido.save()

    res.status(200).json({ mensagem: `Pedido antecipado ${passos} posição(ões) na fila`, pedido: pedido.toObject() })
  } catch (err) {
    console.error('❌ Erro ao antecipar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao antecipar pedido', erro: err.message })
  }
}
const atualizarStatusPedido = async (req, res) => {
  try {
    console.log("➡️ Atualizar status pedido:", req.params.id, req.body.status)

    const { id } = req.params
    const novoStatus = req.body.status

    if (!STATUS_PERMITIDOS.includes(novoStatus)) {
      return res.status(400).json({ mensagem: 'Status inválido', permitidos: STATUS_PERMITIDOS })
    }

    // busca e atualiza de uma vez, já populado pelo pre(/^find/)
    let pedido = await Pedido.findById(id)
    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' })
    }

    console.log("✅ Pedido encontrado:", pedido._id, pedido.status)

    if ([STATUS.PRONTO, STATUS.CANCELADO].includes(pedido.status)) {
      return res.status(400).json({ mensagem: 'Não é possível alterar um pedido já finalizado ou cancelado' })
    }

    pedido.status = novoStatus
    await pedido.save()

    // reconsulta com populate automático
    pedido = await Pedido.findById(pedido._id)

    // integração com CLP
    if (novoStatus === STATUS.EM_PROCESSAMENTO) {
      if (process.env.USE_MOCK === 'true') {
        console.log("⚙️ Mock CLP ativado — não enviando comando real")
      } else {
        const opcua = new OpcuaService()
        await opcua.connect()
        await opcua.escreverPedido({
          op: pedido._id.toString(),
          produto: pedido.itens[0].produtoId._id.toString(),
          quant: pedido.itens[0].quantidade
        })
        await opcua.disconnect()
      }
    }

    res.json({ mensagem: 'Status atualizado com sucesso', pedido })
  } catch (err) {
    console.error('❌ Erro ao atualizar status do pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: err.message })
  }
}

// 📋 Listar pedidos (cliente/admin)
const listarPedidos = async (req, res) => {
  try {
    const isAdmin = req.user?.status === 'admin' || req.user?.status === 'superadmin'
    const filtro = isAdmin ? {} : { codigoCliente: req.user?.codigo }

    // hook pre(/^find/) já popula clienteId e itens.produtoId
    const pedidos = await Pedido.find(filtro).sort({ ordem: 1 })

    res.status(200).json({
      mensagem: 'Pedidos listados com sucesso',
      pedidos: pedidos.map(p => p.toObject())
    })
  } catch (err) {
    console.error('❌ Erro ao listar pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao listar pedidos', erro: err.message })
  }
}

// 📋 Listar pedidos (admin)
const listarPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .sort({ ordem: 1 })
      .populate([
        { path: 'clienteId', select: 'codigo nome email status' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])

    res.status(200).json({ pedidos: pedidos.map(p => p.toObject()) })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar pedidos admin', erro: err.message })
  }
}

// 📋 Listar pedidos (superadmin)
const listarPedidosSuperadmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .sort({ ordem: 1 })
      .populate([
        { path: 'clienteId', select: 'codigo nome email status' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])

    res.status(200).json({ pedidos: pedidos.map(p => p.toObject()) })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao listar pedidos superadmin', erro: err.message })
  }
}

// 📜 Histórico de pedidos (cliente)
const historicoPedidos = async (req, res) => {
  try {
    if (!req.user?.codigo) return res.status(401).json({ mensagem: 'Usuário não autenticado' })

    const cliente = await Cliente.findOne({ codigo: req.user.codigo })
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })

    const pedidos = await Pedido.find({ clienteId: cliente._id })
      .sort({ data: -1 })
      .populate([
        { path: 'clienteId', select: 'codigo nome email status' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])

    res.status(200).json({ mensagem: 'Histórico de pedidos recuperado com sucesso', pedidos: pedidos.map(p => p.toObject()) })
  } catch (err) {
    console.error('❌ Erro ao buscar histórico de pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar histórico de pedidos', erro: err.message })
  }
}

// ❌ Cancelar pedido (cliente)
const cancelarPedido = async (req, res) => {
  try {
    const pedidoPopulado = await pedidoService.atualizarStatusPedido(
      req.params.id,
      STATUS.CANCELADO,
      [
        (pedido) => {
          if (pedido.status === STATUS.PRONTO) throw new Error('Não é possível cancelar um pedido já finalizado')
          if (pedido.status === STATUS.CANCELADO) throw new Error('O pedido já está cancelado')
          if (pedido.status === STATUS.EM_PROCESSAMENTO) throw new Error('Não é possível cancelar um pedido em produção')
        }
      ]
    )
    res.status(200).json({ mensagem: 'Pedido cancelado com sucesso', pedido: pedidoPopulado.toObject() })
  } catch (err) {
    res.status(400).json({ mensagem: err.message })
  }
}

// ✅ Finalizar pedido (cliente)
const finalizarPedido = async (req, res) => {
  try {
    const pedidoPopulado = await pedidoService.atualizarStatusPedido(
      req.params.id,
      STATUS.PRONTO,
      [
        (pedido) => {
          if (pedido.status === STATUS.CANCELADO) throw new Error('Não é possível finalizar um pedido cancelado')
          if (pedido.status === STATUS.PRONTO) throw new Error('O pedido já está finalizado')
        }
      ]
    )
    res.status(200).json({ mensagem: 'Pedido finalizado com sucesso', pedido: pedidoPopulado.toObject() })
  } catch (err) {
    res.status(400).json({ mensagem: err.message })
  }
}

// 📋 Listar todos os pedidos (admin) — opcional
const listarTodosPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('clienteId', 'codigo nome email status')
      .populate('itens.produtoId', 'codigo nome preco status')
      .sort({ data: -1 })

    res.status(200).json({ pedidos })
  } catch (err) {
    console.error('❌ Erro ao buscar todos os pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar todos os pedidos', erro: err.message })
  }
}

// 🗑️ Excluir todos os pedidos de um cliente (admin)
const excluirPedidosClienteAdmin = async (req, res) => {
  try {
    const codigoCliente = req.params.codigoCliente
    const cliente = await Cliente.findOne({ codigo: codigoCliente })
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' })

    const resultado = await Pedido.deleteMany({ clienteId: cliente._id })
    res.status(200).json({ mensagem: 'Pedidos do cliente excluídos com sucesso', resultado })
  } catch (err) {
    console.error('❌ Erro ao excluir pedidos do cliente:', err)
    res.status(500).json({ mensagem: 'Erro ao excluir pedidos do cliente', erro: err.message })
  }
}

// 🧹 Limpar todos os pedidos (admin)
const limparPedidos = async (req, res) => {
  try {
    const resultado = await Pedido.deleteMany({})
    res.status(200).json({ mensagem: 'Todos os pedidos foram removidos', resultado })
  } catch (err) {
    console.error('❌ Erro ao limpar pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao limpar pedidos', erro: err.message })
  }
}

// 🧹 Limpar todos os pedidos do cliente logado
const limparPedidosCliente = async (req, res) => {
  try {
    if (!req.user?.codigo) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' })
    }

    const cliente = await Cliente.findOne({ codigo: req.user.codigo })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    await Pedido.deleteMany({ clienteId: cliente._id })
    res.status(200).json({ mensagem: 'Todos os pedidos do cliente foram removidos com sucesso' })
  } catch (err) {
    console.error('❌ Erro ao limpar pedidos do cliente:', err)
    res.status(500).json({ mensagem: 'Erro ao limpar pedidos do cliente', erro: err.message })
  }
}

// 📊 Gerar balancete (admin)
const gerarBalancete = async (req, res) => {
  try {
    const { periodo } = req.query
    const resultado = await relatorioService.gerarBalancete(periodo)
    res.status(200).json(resultado)
  } catch (err) {
    console.error('❌ Erro ao gerar balancete:', err)
    res.status(400).json({ mensagem: err.message })
  }
}

// 🔄 Reordenação MES
const reordenarFilaMES = async (req, res) => {
  try {
    const { pedidoId } = req.params
    const fila = await mesService.reordenarFilaMES(pedidoId)
    res.status(200).json({ mensagem: 'Fila reordenada pelo MES com sucesso', fila })
  } catch (err) {
    console.error('❌ Erro ao reordenar fila MES:', err)
    res.status(500).json({ mensagem: 'Erro ao reordenar fila MES', erro: err.message })
  }
}

// ✅ Exportações organizadas
module.exports = {
  // Cliente
  cadastrarPedido,
  listarPedidos,
  historicoPedidos,
  cancelarPedido,
  finalizarPedido,
  limparPedidosCliente,

  // Admin
  listarPedidosAdmin,
  listarPedidosSuperadmin,
  listarTodosPedidosAdmin,
  anteciparPedido,
  atualizarStatusPedido,
  excluirPedidosClienteAdmin,
  limparPedidos,
  gerarBalancete,

  // MES
  reordenarFilaMES
}
