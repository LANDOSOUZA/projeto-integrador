// backend/controllers/statusController.js
const useMock = process.env.USE_MOCK === 'true'
const OpcuaService = useMock
  ? require('../services/opcuaServiceMock')
  : require('../services/opcuaService')

const opcua = new OpcuaService()

async function lerStatus(req, res) {
  try {
    await opcua.connect()

    // Lê variáveis em paralelo
    const [
      geral,
      accSinc,
      opAtual,
      falhaAtiva,
      falhaAtivaCod,
      mesProd,
      mesFalt,
      mesPcsBoas,
      mesPcsRuins,
      estoqueProd,
      // campos de data/hora
      iniYear, iniMonth, iniDay, iniHour, iniMinute, iniSecond,
      fimYear, fimMonth, fimDay, fimHour, fimMinute, fimSecond
    ] = await Promise.all([
      opcua.lerStatusGeral(),
      opcua.ler(nodes.status.accSinc),
      opcua.lerOpAtual(),
      opcua.lerFalhaAtiva(),
      opcua.lerFalhaCod(),
      opcua.lerMesProd(),
      opcua.lerMesFalt(),
      opcua.lerMesPcsBoas(),
      opcua.lerMesPcsRuins(),
      opcua.lerEstoqueProd(),
      opcua.ler(nodes.status.mesTempInicioYear),
      opcua.ler(nodes.status.mesTempInicioMonth),
      opcua.ler(nodes.status.mesTempInicioDay),
      opcua.ler(nodes.status.mesTempInicioHour),
      opcua.ler(nodes.status.mesTempInicioMinute),
      opcua.ler(nodes.status.mesTempInicioSecond),
      opcua.ler(nodes.status.mesTempFimYear),
      opcua.ler(nodes.status.mesTempFimMonth),
      opcua.ler(nodes.status.mesTempFimDay),
      opcua.ler(nodes.status.mesTempFimHour),
      opcua.ler(nodes.status.mesTempFimMinute),
      opcua.ler(nodes.status.mesTempFimSecond)
    ])

    // Monta objetos de data/hora
    const mesTempInicio = { year: iniYear, month: iniMonth, day: iniDay, hour: iniHour, minute: iniMinute, second: iniSecond }
    const mesTempFim = { year: fimYear, month: fimMonth, day: fimDay, hour: fimHour, minute: fimMinute, second: fimSecond }

    // Retorna JSON pronto para o frontend
    res.json({
      geral,
      accSinc,
      opAtual,
      falhaAtiva,
      falhaAtivaCod,
      mesProd,
      mesFalt,
      mesPcsBoas,
      mesPcsRuins,
      estoqueProd,
      mesTempInicio,
      mesTempFim
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
