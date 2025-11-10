// middleware/verificarSuperAdmin.js
function verificarSuperAdmin(req, res, next) {
  if (req.user?.status !== 'superadmin') {
    console.warn(`Acesso negado: usuário ${req.user?.email || 'desconhecido'} tentou acessar rota de superadmin`)
    return res.status(403).json({ mensagem: 'Acesso restrito ao superadmin' })
  }
  next()
}

module.exports = verificarSuperAdmin
