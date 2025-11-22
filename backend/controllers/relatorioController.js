const useMock = process.env.USE_MOCK === 'true'

const relatorioService = useMock
  ? require('../services/relatorioServiceMock')
  : require('../services/relatorioService')

async function getRelatorio(req, res) {
  try {
    const { periodo } = req.params
    const relatorio = await relatorioService.gerarBalancete(periodo, 'finalizado')
    res.json(relatorio)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar relatório', details: err.message })
  }
}

module.exports = { getRelatorio }
