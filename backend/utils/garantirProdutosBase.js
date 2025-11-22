// backend/utils/garantirProdutosBase.js
const Produto = require('../models/Produto')

async function garantirProdutosBase() {
  const produtosBase = [
    {
      id: 1,
      nome: "Suco de Laranja",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha da laranjeira.",
      preco: 12.00,
      status: "ativo",
      quantidade: 3, // 👈 estoque inicial
      criadoEm: new Date("2025-11-02T00:00:00Z")
    },
    {
      id: 2,
      nome: "Suco de Limão",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha do limoeiro.",
      preco: 12.00,
      status: "ativo",
      quantidade: 3, // 👈 estoque inicial
      criadoEm: new Date("2025-11-02T00:00:00Z")
    },
    {
      id: 3,
      nome: "Suco de Morango",
      peso: "500 ml",
      descricao: "Produto produzido exclusivamente da fruta e não da folha do morangueiro.",
      preco: 12.00,
      status: "ativo",
      quantidade: 3, // 👈 estoque inicial
      criadoEm: new Date("2025-11-02T00:00:00Z")
    }
  ]

  for (const base of produtosBase) {
    // Checa pelo nome em vez de id
    const existente = await Produto.findOne({ nome: base.nome })
    if (!existente) {
      await Produto.create({
        ...base,
        criadoEm: new Date() // data/hora atual
      })
      console.log(`✅ Produto base criado: ${base.nome}`)
    }
  }
}

module.exports = garantirProdutosBase
