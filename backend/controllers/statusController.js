// Troque entre o real e o mock
const useMock = process.env.USE_MOCK === 'true'

const OpcuaService = useMock
  ? require('../services/opcuaServiceMock')
  : require('../services/opcuaService')

const Status = require('../models/StatusModel')
const opcua = new OpcuaService()

async function lerStatus(req, res) {
  try {
    await opcua.connect()

    const geral = await opcua.lerStatusGeral()
    const accSinc = await opcua.lerAccSinc()
    const opAtual = await opcua.lerOpAtual()

    const falhaAtiva = await opcua.lerFalhaAtiva()
    const falhaAtivaCod = await opcua.lerFalhaAtivaCod()

    const abacaxiDisponivel = await opcua.lerDisponibilidade('abacaxi')
    const laranjaDisponivel = await opcua.lerDisponibilidade('laranja')
    const uvaDisponivel = await opcua.lerDisponibilidade('uva')

    const mesProd = await opcua.lerMesProd()
    const mesFalt = await opcua.lerMesFalt()
    const mesUltimoCiclo = await opcua.lerMesUltimoCiclo()
    const mesTempInicio = await opcua.lerMesTempInicio()
    const mesTempFim = await opcua.lerMesTempFim()
    const mesPcsBoas = await opcua.lerMesPcsBoas()
    const mesPcsRuins = await opcua.lerMesPcsRuins()

    const status = new Status({
      geral,
      accSinc,
      opAtual,
      falhaAtiva,
      falhaAtivaCod,
      abacaxiDisponivel,
      laranjaDisponivel,
      uvaDisponivel,
      mesProd,
      mesFalt,
      mesUltimoCiclo,
      mesTempInicio,
      mesTempFim,
      mesPcsBoas,
      mesPcsRuins
    })

    res.json(status)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar status', details: err.message })
  } finally {
    try { await opcua.disconnect() } catch {}
  }
}

module.exports = { lerStatus }