// backend/utils/garantirProdutosBase.js
const Produto = require('../models/Produto')

async function garantirProdutosBase() {
  const produtosBase = [
    {
      id: 1,
      nome: "Suco de Abacaxi",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha do abacaxi.",
      preco: 12.00,
      status: "ativo",
      criadoEm: new Date("2025-11-02T00:00:00Z")
    },
    {
      id: 2,
      nome: "Suco de Laranja",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha de laranja.",
      preco: 12.00,
      status: "ativo",
      criadoEm: new Date("2025-11-02T00:00:00Z")
    },
    {
      id: 3,
      nome: "Suco de Uva",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha da videira.",
      preco: 12.00,
      status: "ativo",
      criadoEm: new Date("2025-11-02T00:00:00Z")
    }
  ]

  for (const base of produtosBase) {
    const existente = await Produto.findOne({ id: base.id })
    if (!existente) {
      await Produto.create(base)
      console.log(`✅ Produto base criado: ${base.nome} (Id ${base.id})`)
    }
  }
}

module.exports = garantirProdutosBase