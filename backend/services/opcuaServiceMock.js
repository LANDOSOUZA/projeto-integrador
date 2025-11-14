class OpcuaServiceMock {
  async connect() {
    console.log('🔌 Mock conectado (sem CLP)')
  }

  async disconnect() {
    console.log('❌ Mock desconectado')
  }

  // Estado geral da planta
  async lerStatusGeral() { return 'Produzindo' }
  async lerAccSinc() { return 12345 }
  async lerOpAtual() { return 1001 }

  // Falhas
  async lerFalhaAtiva() { return false }
  async lerFalhaAtivaCod() { return 0 }

  // Disponibilidade das peças (3 de cada sabor)
  async lerDisponibilidade(sabor) {
    // Simula que todas estão disponíveis
    return true
  }

  // KPIs de produção
  async lerMesProd() { return 50 }
  async lerMesFalt() { return 5 }
  async lerMesUltimoCiclo() { return 2.5 }
  async lerMesTempInicio() { return new Date(Date.now() - 150000) }
  async lerMesTempFim() { return new Date() }
  async lerMesPcsBoas() { return 48 }
  async lerMesPcsRuins() { return 2 }
}

module.exports = OpcuaServiceMock
