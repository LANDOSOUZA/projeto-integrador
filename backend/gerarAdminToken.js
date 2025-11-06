const jwt = require('jsonwebtoken')

const token = jwt.sign(
  {
    id: "admin-id-fixo",
    codigo: 0,
    nome: "Admin",
    email: "admin@admin.com",
    status: "admin"
  },
  "meusegredoforte123", // mesmo segredo do seu .env
  { expiresIn: "24h" }
)

console.log("Novo ADMIN_TOKEN:", token)
