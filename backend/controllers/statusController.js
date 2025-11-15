// controllers/statusController.js
const useMock = process.env.USE_MOCK === 'true'
const OpcuaService = useMock
  ? require('../services/opcuaServiceMock')
  : require('../services/opcuaService')

const opcua = new OpcuaService()

async function lerStatus(req, res) {
  try {
    await opcua.connect()

    // Lê todas as variáveis em paralelo para reduzir latência
    const [
      geral,
      accSinc,
      opAtual,
      falhaAtiva,
      falhaAtivaCod,
      mesProd,
      mesFalt,
      mesUltimoCiclo,
      mesTempInicio,
      mesTempFim,
      mesPcsBoas,
      mesPcsRuins
    ] = await Promise.all([
      opcua.lerStatusGeral(),
      opcua.lerAccSinc(),
      opcua.lerOpAtual(),
      opcua.lerFalhaAtiva(),
      opcua.lerFalhaAtivaCod(),
      opcua.lerMesProd(),
      opcua.lerMesFalt(),
      opcua.lerMesUltimoCiclo(),
      opcua.lerMesTempInicio(),
      opcua.lerMesTempFim(),
      opcua.lerMesPcsBoas(),
      opcua.lerMesPcsRuins()
    ])

    // Retorna JSON pronto para o frontend
    res.json({
      geral,
      accSinc,
      opAtual,
      falhaAtiva,
      falhaAtivaCod,
      mesProd,
      mesFalt,
      mesUltimoCiclo,
      mesTempInicio,
      mesTempFim,
      mesPcsBoas,
      mesPcsRuins
    })
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao consultar status',
      details: err.message
    })
  } finally {
    try { await opcua.disconnect() } catch {}
  }
}

module.exports = { lerStatus }
