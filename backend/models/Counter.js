// models/Counter.js
const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true }, // ex: "usuario", "admin", "pedido"
  seq: { type: Number, default: 0 }
})

module.exports = mongoose.model('Counter', counterSchema)

