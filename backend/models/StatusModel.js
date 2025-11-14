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
    this.geral = geral;              // INT
    this.falhaAtiva = falhaAtiva;    // BOOL
    this.falhaAtivaCod = falhaAtivaCod; // INT
    this.accSinc = accSinc;          // UDINT
    this.opAtual = opAtual;          // DINT
    this.estoqueProd = estoqueProd;  // array[3] int
    this.mesProd = mesProd;          // INT
    this.mesFalt = mesFalt;          // INT
    this.mesTempInicio = mesTempInicio; // Date
    this.mesTempFim = mesTempFim;    // Date
    this.mesPcsBoas = mesPcsBoas;    // INT
    this.mesPcsRuins = mesPcsRuins;  // INT
  }
}

module.exports = Status;
