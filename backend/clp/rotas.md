📌 Rotas de Cliente
Criar cliente POST http://localhost:3000/cliente Body: dados do cliente

📌 Rotas de Produto
Listar produtos GET http://localhost:3000/produto

📌 Rotas de Pedido
Prefixo: /pedido (todas exigem token)

Listar pedidos do cliente GET http://localhost:3000/pedido

Criar pedido POST http://localhost:3000/pedido Body:

json
{
  "itens": [
    { "produtoId": "ID_PRODUTO", "quantidade": 2 }
  ]
}
Atualizar status de pedido (Admin) PUT http://localhost:3000/pedido/:id/status Body:

json
{ "status": "processando" }
Cancelar pedido DELETE http://localhost:3000/pedido/:id

📌 Rotas de Admin
Prefixo: /admin (todas exigem token + verificarAdmin)

Criar admin (SuperAdmin) POST http://localhost:3000/admin/criar Body:

json
{ "email": "novo@admin.com", "senha": "123456" }
Excluir admin (SuperAdmin) DELETE http://localhost:3000/admin/excluir/:id

Listar admins GET http://localhost:3000/admin/listar

Repor estoque (Admin) POST http://localhost:3000/admin/estoque/repor Body:

json
{ "pedidoId": "ID_PEDIDO", "itemId": "ID_ITEM" }
Controle CLP (Admin)

Iniciar: POST http://localhost:3000/admin/clp/iniciar

Parar: POST http://localhost:3000/admin/clp/parar

Status: GET http://localhost:3000/admin/clp/status

📌 Rotas de Estoque
Prefixo: /estoque

Repor estoque (rota direta) POST http://localhost:3000/estoque/repor Body:

json
{ "pedidoId": "ID_PEDIDO", "itemId": "ID_ITEM" }
📌 Rotas de CLP (SuperAdmin)
Prefixo: /clp

Atualizar status do CLP POST http://localhost:3000/clp/status Body:

json
{ "pedidoId": "ID_PEDIDO", "status": "processando", "itemId": "ID_ITEM" }
🚀 Resumo prático para Insomnia
Pedidos cliente: GET /pedido

Pedidos admin: GET /admin/listar

Atualizar status: PUT /pedido/:id/status

Repor estoque: POST /estoque/repor ou POST /admin/estoque/repor

CLP: POST /clp/status