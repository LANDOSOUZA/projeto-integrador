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

    // 🔑 Agora req.cliente carrega o payload do token (com status)
    req.cliente = cliente;

    next();
  });
}

module.exports = autenticarToken;
