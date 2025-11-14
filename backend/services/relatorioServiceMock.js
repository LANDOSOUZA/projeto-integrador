class RelatorioServiceMock {
  async gerarBalancete(periodo, status = 'finalizado') {
    console.log(`📊 Mock de relatório gerado para período: ${periodo}, status: ${status}`)

    // Simula intervalo de datas
    const hoje = new Date()
    const inicio = new Date(hoje)
    inicio.setMonth(inicio.getMonth() - 1)

    // Dados fictícios de pedidos sob demanda
    const resumo = [
      { produto: 'abacaxi', pedidosAtendidos: 15, quantidadeTotal: 45 },
      { produto: 'laranja', pedidosAtendidos: 12, quantidadeTotal: 36 },
      { produto: 'uva', pedidosAtendidos: 18, quantidadeTotal: 54 }
    ]

    return {
      periodo,
      desde: inicio.toLocaleDateString('pt-BR'),
      ate: hoje.toLocaleDateString('pt-BR'),
      resumo
    }
  }
}

module.exports = new RelatorioServiceMock()
