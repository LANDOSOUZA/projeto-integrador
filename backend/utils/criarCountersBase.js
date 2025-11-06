// utils/criarCountersBase.js
const mongoose = require('mongoose')
const Counter = require('../models/Counter')

async function criarCountersBase() {
  try {
    // Lista de contadores que você quer garantir
    const contadores = ['usuario', 'admin', 'pedido']

    for (const nome of contadores) {
      const existe = await Counter.findOne({ nome })
      if (!existe) {
        await Counter.create({ nome, seq: 0 })
        console.log(`✅ Contador criado: ${nome} -> seq: 0`)
      } else {
        console.log(`ℹ️ Contador já existe: ${nome} -> seq: ${existe.seq}`)
      }
    }
  } catch (err) {
    console.error("❌ Erro ao criar counters base:", err)
  }
}

module.exports = criarCountersBase
