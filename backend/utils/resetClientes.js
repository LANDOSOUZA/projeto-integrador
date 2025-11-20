// utils/resetClientes.js
const mongoose = require("mongoose");
const Cliente = require("../models/Cliente"); // ajuste o caminho conforme seu projeto

async function resetClientes() {
  try {
    // conecta ao banco
    await mongoose.connect(process.env.MONGO_URL);

    // apaga todos os registros da coleção clientes
    const result = await Cliente.deleteMany({});
    console.log(`🗑️ Coleção clientes limpa. Registros removidos: ${result.deletedCount}`);

    // encerra conexão
    await mongoose.disconnect();
    console.log("✅ Conexão encerrada.");
  } catch (err) {
    console.error("Erro ao limpar clientes:", err);
  }
}

resetClientes();