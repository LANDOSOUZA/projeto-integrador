// middleware/verificarAdmin.js
function verificarAdmin(req, res, next) {
  const status = req.user?.status
  if (status !== 'admin' && status !== 'superadmin') {
    console.warn(`Acesso negado: usuário ${req.user?.email || 'desconhecido'} tentou acessar rota de admin`)
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores' })
  }
  next()
}

module.exports = verificarAdmin
