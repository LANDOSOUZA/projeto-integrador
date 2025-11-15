const Pedido = require('../models/Pedido')

async function gerarBalancete(periodo, status = 'finalizado') {
  const inicio = calcularDataInicial(periodo)
  if (!inicio) {
    return {
      error: 'Período inválido',
      permitido: [
        'diario','semanal','mensal',
        'bimestral','trimestral','semestral','anual'
      ]
    }
  }

  const filtro = { data: { $gte: inicio } }
  if (status) filtro.status = status

  const resumo = await Pedido.aggregate([
    { $match: filtro },
    {
      $lookup: {
        from: 'produtos',              // coleção de produtos
        localField: 'produto',         // campo em Pedido
        foreignField: '_id',           // campo em Produto
        as: 'produtoInfo'
      }
    },
    { $unwind: '$produtoInfo' },
    {
      $group: {
        _id: '$produtoInfo.nome',      // agrupa pelo nome do produto
        pedidosAtendidos: { $sum: 1 },
        quantidadeTotal: { $sum: '$quantidade' }
      }
    },
    { $sort: { quantidadeTotal: -1 } }
  ])

  return {
    periodo,
    desde: inicio.toLocaleDateString('pt-BR'),
    ate: new Date().toLocaleDateString('pt-BR'),
    resumo
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

  return data
}

module.exports = { gerarBalancete }
