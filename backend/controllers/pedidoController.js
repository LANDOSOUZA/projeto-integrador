const Pedido = require('../models/Pedido')
const Cliente = require('../models/Cliente')
const pedidoService = require('../services/pedidoService')
const relatorioService = require('../services/relatorioService')
const mesService = require('../services/mesService')
const OpcuaService = require('../services/opcuaService')

// 🔖 Status padronizados
const STATUS = {
  INICIADO: 'iniciado',
  PROCESSANDO: 'em_processamento',
  PRONTO: 'pronto',
  CANCELADO: 'cancelado'
}
const STATUS_PERMITIDOS = Object.values(STATUS)

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
      status: { $in: [STATUS.INICIADO, STATUS.PROCESSANDO] }
    })
    if (pedidosAtivos >= 3) {
      return res.status(400).json({ mensagem: 'Limite de 3 pedidos ativos atingido' })
    }

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

    const itensConvertidos = await pedidoService.converterItens(itens)

    const novoPedido = new Pedido({
      clienteId: cliente._id,
      codigoCliente: cliente.codigo,
      itens: itensConvertidos,
      status: STATUS.INICIADO,
      data: new Date()
    })

    await novoPedido.save()

    const pedidoPopulado = await novoPedido.populate([
      { path: 'clienteId', select: 'codigo nome email perfil' },
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

// 📌 Atualizar status do pedido (Admin → dispara CLP quando em_processamento)
const atualizarStatusPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' })
    }

    const novoStatus = req.body.status
    if (!STATUS_PERMITIDOS.includes(novoStatus)) {
      return res.status(400).json({ mensagem: 'Status inválido', permitidos: STATUS_PERMITIDOS })
    }

    if ([STATUS.PRONTO, STATUS.CANCELADO].includes(pedido.status)) {
      return res.status(400).json({ mensagem: 'Não é possível alterar um pedido já finalizado ou cancelado' })
    }

    pedido.status = novoStatus
    await pedido.save()

    if (novoStatus === STATUS.PROCESSANDO) {
      const opcua = new OpcuaService()
      await opcua.connect()
      await opcua.escreverPedido({
        op: pedido._id.toString(),
        produto: pedido.itens[0].produtoId._id?.toString() ?? pedido.itens[0].produtoId, // garante campo existente
        quant: pedido.itens[0].quantidade
      })
      await opcua.disconnect()
    }

    res.json({ mensagem: 'Status atualizado com sucesso', pedido: pedido.toObject() })
  } catch (err) {
    console.error('❌ Erro ao atualizar status do pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: err.message })
  }
}

// 📋 Listar pedidos (cliente/admin)
const listarPedidos = async (req, res) => {
  try {
    const filtro = req.user?.perfil === 'admin'
      ? {}
      : { codigoCliente: req.user?.codigo }

    const pedidos = await Pedido.find(filtro)
      .sort({ data: -1 })
      .populate([
        { path: 'clienteId', select: 'codigo nome email perfil' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])

    res.status(200).json({
      mensagem: 'Pedidos listados com sucesso',
      pedidos: pedidos.map(p => p.toObject())
    })
  } catch (err) {
    console.error('❌ Erro ao listar pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao listar pedidos', erro: err.message })
  }
}

// 📜 Histórico de pedidos (cliente)
const historicoPedidos = async (req, res) => {
  try {
    if (!req.user?.codigo) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' })
    }

    const cliente = await Cliente.findOne({ codigo: req.user.codigo })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    const pedidos = await Pedido.find({ clienteId: cliente._id })
      .sort({ data: -1 })
      .populate([
        { path: 'clienteId', select: 'codigo nome email perfil' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])

    res.status(200).json({
      mensagem: 'Histórico de pedidos recuperado com sucesso',
      pedidos: pedidos.map(p => p.toObject())
    })
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
          if (pedido.status === STATUS.PROCESSANDO) throw new Error('Não é possível cancelar um pedido em produção')
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

// 📋 Listar todos os pedidos (admin)
const listarTodosPedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('clienteId', 'codigo nome email perfil')
      .populate('itens.produtoId', 'codigo nome preco status')
      .sort({ data: -1 })

    res.status(200).json({ pedidos })
  } catch (err) {
    console.error('❌ Erro ao buscar todos os pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar todos os pedidos', erro: err.message })
  }
}

// ⏩ Antecipar pedido (admin) — respeita sequência e dispara CLP ao entrar em processamento
const anteciparPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
    if (!pedido) return res.status(404).json({ mensagem: 'Pedido não encontrado' })

    if (pedido.status === STATUS.CANCELADO) {
      return res.status(400).json({ mensagem: 'Não é possível antecipar um pedido cancelado' })
    }
    if (pedido.status === STATUS.PRONTO) {
      return res.status(400).json({ mensagem: 'O pedido já está pronto e não pode ser antecipado' })
    }

    let novoStatus = pedido.status
    if (pedido.status === STATUS.INICIADO) novoStatus = STATUS.PROCESSANDO
    else if (pedido.status === STATUS.PROCESSANDO) novoStatus = STATUS.PRONTO

    pedido.status = novoStatus
    await pedido.save()

    if (novoStatus === STATUS.PROCESSANDO) {
      const opcua = new OpcuaService()
      await opcua.connect()
      await opcua.escreverPedido({
        op: pedido._id.toString(),
        produto: pedido.itens[0].produtoId._id?.toString() ?? pedido.itens[0].produtoId,
        quant: pedido.itens[0].quantidade
      })
      await opcua.disconnect()
    }

    res.status(200).json({ mensagem: 'Pedido atualizado com sucesso', pedido: pedido.toObject() })
  } catch (err) {
    console.error('❌ Erro ao antecipar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar pedido', erro: err.message })
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
  listarTodosPedidosAdmin,
  anteciparPedido,
  excluirPedidosClienteAdmin,
  limparPedidos,
  gerarBalancete,
  atualizarStatusPedido,

  // MES
  reordenarFilaMES
}
