const jwt = require('jsonwebtoken')

function gerarAdminToken(usuario) {
  return jwt.sign(
    {
      id: usuario._id,
      codigo: usuario.codigo,
      nome: usuario.nome,
      email: usuario.email,
      status: usuario.status   // <-- pega do banco, não fixo
    },
    process.env.JWT_SECRET,    // use o segredo do seu .env
    { expiresIn: "24h" }
  )
}

module.exports = gerarAdminToken

