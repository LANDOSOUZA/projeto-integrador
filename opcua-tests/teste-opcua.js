const { OPCUAClient } = require("node-opcua");

async function main() {
  try {
    const endpointUrl = "opc.tcp://localhost:4840"; // ajuste se necessário

    const client = OPCUAClient.create({
      endpointMustExist: false
    });

    console.log("🔌 Conectando ao servidor:", endpointUrl);

    await client.connect(endpointUrl);
    console.log("✅ Conexão estabelecida com sucesso!");

    await client.disconnect();
    console.log("🔌 Conexão encerrada.");
  } catch (err) {
    console.error("❌ Erro na conexão:", err.message);
  }
}

main();
