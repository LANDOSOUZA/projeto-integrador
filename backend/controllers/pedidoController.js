const Pedido = require('../models/Pedido')
const Cliente = require('../models/Cliente')

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

    const total = itens.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0)
    if (total < 1 || total > 3) {
      return res.status(400).json({ mensagem: 'O pedido deve ter entre 1 e 3 sucos' })
    }

    const contagem = {}
    for (const item of itens) {
      const q = Number(item.quantidade) || 0
      if (q < 1) {
        return res.status(400).json({ mensagem: 'Quantidade inválida' })
      }
      contagem[item.produtoId] = (contagem[item.produtoId] || 0) + q
    }

    const quantidades = Object.values(contagem)
    const tresSabores = quantidades.length === 3 && quantidades.every(q => q === 1)
    const tresDeUm = quantidades.length === 1 && quantidades[0] === 3
    const doisMaisUm = quantidades.length === 2 && quantidades.includes(2) && quantidades.includes(1)
    const doisDeUm = quantidades.length === 1 && quantidades[0] === 2
    const umDeUm = quantidades.length === 1 && quantidades[0] === 1

    if (!(tresSabores || tresDeUm || doisMaisUm || doisDeUm || umDeUm)) {
      return res.status(400).json({ mensagem: 'Combinação de sucos inválida' })
    }

    const novoPedido = new Pedido({
      clienteId: cliente._id,
      codigoCliente: cliente.codigo,
      itens,
      status: 'iniciado',
      data: new Date()
    })

    await novoPedido.save()

    res.status(201).json({
      mensagem: 'Pedido cadastrado com sucesso',
      pedido: await novoPedido.populate([
        { path: 'clienteId', select: 'codigo nome email perfil' },
        { path: 'itens.produtoId', select: 'codigo nome preco status' }
      ])
    })
  } catch (err) {
    console.error('❌ Erro ao cadastrar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao cadastrar pedido', erro: err.message })
  }
}



// 📋 Listar pedidos do cliente logado
const listarPedidos = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' })
    }

    const { codigo } = req.user
    const cliente = await Cliente.findOne({ codigo })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    const pedidos = await Pedido.find({ clienteId: cliente._id })
      .populate('clienteId', 'codigo nome email perfil')
      .populate('itens.produtoId', 'codigo nome preco status')
      .sort({ data: -1 })

    res.status(200).json({ pedidos })
  } catch (err) {
    console.error('❌ Erro ao buscar pedidos:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos', erro: err.message })
  }
}

// 🕓 Histórico de pedidos do cliente
const historicoPedidos = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado' })
    }

    const { codigo } = req.user
    const cliente = await Cliente.findOne({ codigo })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }

    const historico = await Pedido.find({ clienteId: cliente._id })
      .populate('clienteId', 'codigo nome email perfil')
      .populate('itens.produtoId', 'codigo nome preco status')
      .sort({ data: -1 })

    res.status(200).json({ historico })
  } catch (err) {
    console.error('❌ Erro ao buscar histórico:', err)
    res.status(500).json({ mensagem: 'Erro ao buscar histórico', erro: err.message })
  }
}

// ❌ Cancelar pedido
const cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params
    const pedido = await Pedido.findById(id)

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' })
    }

    if (pedido.status === 'pronto') {
      return res.status(400).json({ mensagem: 'Não é possível cancelar um pedido que já está pronto' })
    }

    if (pedido.status === 'cancelado') {
      return res.status(400).json({ mensagem: 'O pedido já está cancelado' })
    }

    pedido.status = 'cancelado'
    await pedido.save()

    res.status(200).json({ mensagem: 'Pedido cancelado com sucesso', pedido })
  } catch (err) {
    console.error('❌ Erro ao cancelar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao cancelar pedido', erro: err.message })
  }
}

// ========================
// 🔧 Rotas Administrativas
// ========================

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

// ⏩ Antecipar pedido (avanço de status pelo admin)
const anteciparPedido = async (req, res) => {
  try {
    const { id } = req.params
    const pedido = await Pedido.findById(id)

    if (!pedido) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado' })
    }

    if (pedido.status === 'cancelado') {
      return res.status(400).json({ mensagem: 'Não é possível antecipar um pedido cancelado' })
    }

    if (pedido.status === 'pronto') {
      return res.status(400).json({ mensagem: 'O pedido já está pronto e não pode ser antecipado' })
    }

    if (pedido.status === 'iniciado') {
      pedido.status = 'em_processamento'
    } else if (pedido.status === 'em_processamento') {
      pedido.status = 'pronto'
    }

    await pedido.save()

    res.status(200).json({ mensagem: 'Pedido atualizado com sucesso', pedido })
  } catch (err) {
    console.error('❌ Erro ao antecipar pedido:', err)
    res.status(500).json({ mensagem: 'Erro ao atualizar pedido', erro: err.message })
  }
}

// 🗑️ Excluir todos os pedidos de um cliente (admin)
const excluirPedidosClienteAdmin = async (req, res) => {
  try {
    const { codigoCliente } = req.params
    const cliente = await Cliente.findOne({ codigo: Number(codigoCliente) })
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' })
    }
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

// 📊 Gerar balancete (admin) — soma das quantidades por produto
const gerarBalancete = async (req, res) => {
  try {
    const { periodo } = req.query
    const dataInicial = calcularDataInicial(periodo)
    if (!dataInicial) {
      return res.status(400).json({ mensagem: 'Período inválido. Use: diario, semanal, mensal, bimestral, trimestral, semestral ou anual.' })
    }

    const inicio = new Date(dataInicial.split('/').reverse().join('-'))

    const resumo = await Pedido.aggregate([
      { $match: { data: { $gte: inicio } } },
      { $unwind: "$itens" },
      {
        $group: {
          _id: "$itens.produtoId",
          quantidadeTotal: { $sum: "$itens.quantidade" }
        }
      },
      {
        $lookup: {
          from: "produtos",
          localField: "_id",
          foreignField: "_id",
          as: "produto"
        }
      },
      { $unwind: "$produto" },
      {
        $project: {
          _id: 0,
          codigo: "$produto.codigo",
          nome: "$produto.nome",
          quantidadeTotal: 1
        }
      }
    ])

    res.status(200).json({
      periodo,
      desde: dataInicial,
      ate: new Date().toLocaleDateString('pt-BR'),
      resumo
    })
  } catch (err) {
    console.error('❌ Erro ao gerar balancete:', err)
    res.status(500).json({ mensagem: 'Erro ao gerar balancete', erro: err.message })
  }
}

function calcularDataInicial(periodo) {
  const hoje = new Date()
  const data = new Date(hoje)

  switch (periodo) {
    case 'diario': data.setDate(data.getDate() - 1); break
    case 'semanal': data.setDate(data.getDate() - 7); break
    case 'mensal': data.setMonth(data.getMonth() - 1); break
    case 'bimestral': data.setMonth(data.getMonth() - 2); break
    case 'trimestral': data.setMonth(data.getMonth() - 3); break
    case 'semestral': data.setMonth(data.getMonth() - 6); break
    case 'anual': data.setFullYear(data.getFullYear() - 1); break
    default: return null
  }

  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

// ========================
// 🔄 Reordenação MES
// ========================
const reordenarFilaMES = async (req, res) => {
  try {
    const { pedidoId } = req.params
    const pedidos = await Pedido.find({ status: 'iniciado' }).populate('itens.produtoId')

    if (pedidos.length <= 2) {
      return res.status(400).json({ mensagem: 'Não há pedidos suficientes para reordenação pelo MES' })
    }

    // Sabores dos dois primeiros pedidos
    const saboresPrimeiros = new Set()
    pedidos.slice(0, 2).forEach(p => {
      p.itens.forEach(i => saboresPrimeiros.add(i.produtoId.nome))
    })

    // Índice do pedido alvo
    const pedidoIndex = pedidos.findIndex(p => p._id.toString() === pedidoId)
    if (pedidoIndex === -1) {
      return res.status(404).json({ mensagem: 'Pedido não encontrado na fila' })
    }
    if (pedidoIndex <= 1) {
      return res.status(400).json({ mensagem: 'O MES não pode alterar os dois primeiros pedidos' })
    }

    // Verifica “novo sabor”
    const saboresPedido = new Set()
    pedidos[pedidoIndex].itens.forEach(i => saboresPedido.add(i.produtoId.nome))
    const contemNovoSabor = [...saboresPedido].some(sabor => !saboresPrimeiros.has(sabor))

    if (!contemNovoSabor) {
      return res.status(403).json({ mensagem: 'O MES não pode antecipar este pedido, pois não contém novos sabores' })
    }

    // Move para a 2ª posição
    const [pedidoMovido] = pedidos.splice(pedidoIndex, 1)
    pedidos.splice(1, 0, pedidoMovido)

    // Persiste posição (se usar posicaoFila no schema)
    for (let i = 0; i < pedidos.length; i++) {
      pedidos[i].posicaoFila = i + 1
      await pedidos[i].save()
    }

    res.status(200).json({
      mensagem: 'Fila reordenada pelo MES com sucesso',
      fila: pedidos
    })
  } catch (err) {
    console.error('❌ Erro ao reordenar fila MES:', err)
    res.status(500).json({ mensagem: 'Erro ao reordenar fila MES', erro: err.message })
  }
}

// ✅ Exportações
module.exports = {
  cadastrarPedido,
  listarPedidos,
  historicoPedidos,
  cancelarPedido,
  listarTodosPedidosAdmin,
  anteciparPedido,
  excluirPedidosClienteAdmin,
  limparPedidos,
  gerarBalancete,
  reordenarFilaMES
}
