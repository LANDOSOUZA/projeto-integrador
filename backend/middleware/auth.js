const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'segredo', (err, cliente) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
    }

    req.cliente = cliente;

    // 🔒 Verifica se a rota exige perfil de administrador
    const rotaEhAdmin = req.originalUrl.includes('/cliente/todos');
    if (rotaEhAdmin && cliente.perfil !== 'admin') {
      return res.status(403).json({ mensagem: 'Acesso restrito a administradores' });
    }

    next();
  });
}

module.exports = autenticarToken;
