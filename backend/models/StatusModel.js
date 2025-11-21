//backend/models/StatusModel.js
class Status {
  constructor({
    geral,
    falhaAtiva,
    falhaAtivaCod,
    accSinc,
    opAtual,
    estoqueProd,
    mesProd,
    mesFalt,
    mesTempInicio,
    mesTempFim,
    mesPcsBoas,
    mesPcsRuins
  }) {
    this.geral = geral              // INT
    this.falhaAtiva = falhaAtiva    // BOOL
    this.falhaAtivaCod = falhaAtivaCod // INT
    this.accSinc = accSinc          // UDINT
    this.opAtual = opAtual          // DINT

    // Normaliza estoque em objeto legível
    this.estoqueProd = {
      limao: estoqueProd[0],
      morango: estoqueProd[1],
      laranja: estoqueProd[2]
    }

    this.mesProd = mesProd          // INT
    this.mesFalt = mesFalt          // INT

    // Datas estruturadas
    this.mesTempInicio = mesTempInicio // {year, month, day, hour, minute, second}
    this.mesTempFim = mesTempFim       // {year, month, day, hour, minute, second}

    this.mesPcsBoas = mesPcsBoas    // INT
    this.mesPcsRuins = mesPcsRuins  // INT
  }
}

module.exports = Status
