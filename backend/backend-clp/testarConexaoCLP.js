console.log("🚀 Iniciando conexão OPC UA...");

const {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy
} = require("node-opcua");

const endpointUrl = "opc.tcp://192.168.0.1:4840"; // IP do CLP simulado

(async () => {
  try {
    const client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false
    });

    await client.connect(endpointUrl);
    console.log("✅ Conectado ao CLP OPC UA!");

    const session = await client.createSession();
    console.log("🟢 Sessão criada com sucesso.");

    // Aqui você pode ler ou escrever variáveis
    // Exemplo: await session.readVariableValue("ns=3;s=status_geral");

    await session.close();
    await client.disconnect();
    console.log("🔒 Sessão encerrada e cliente desconectado.");
  } catch (err) {
    console.error("❌ Erro ao conectar:", err.message);
  }
})();
