// middleware/verificarAdmin.js

function verificarAdmin(req, res, next) {
  // Aqui usamos o campo "status" do token, que já vimos que vem como "usuario" ou "admin"
  if (req.user?.status !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' })
  }
  next()
}

module.exports = verificarAdmin
