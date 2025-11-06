const bcrypt = require('bcrypt')

async function testar() {
  const hash = "$2b$10$QjoPYLS91PEISrY6Sf7ERuH7xeAUowD8XoFPp9WFv3GW.2B525RyC"
  const senhaDigitada = "@L11Lando02025"

  const resultado = await bcrypt.compare(senhaDigitada, hash)
  console.log("Senha confere?", resultado)
}

testar()
