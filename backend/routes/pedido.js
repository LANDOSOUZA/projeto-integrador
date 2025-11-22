// 📂 src/routes/pedidos.js
const express = require("express");
const router = express.Router();

const autenticarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');
const pedidoController = require('../controllers/pedidoController');

// ========================
// Rotas de Admin
// ========================

// Limpar todos os pedidos (Admin)
router.delete("/admin/limpar", autenticarToken, verificarAdmin, pedidoController.limparPedidos);

// Gerar balancete (Admin)
router.get("/admin/balancete", autenticarToken, verificarAdmin, pedidoController.gerarBalancete);

// Atualizar status de pedido (Admin → dispara CLP quando status = em_processamento)
router.put("/admin/:id/status", autenticarToken, verificarAdmin, pedidoController.atualizarStatusPedido);

// Antecipar pedido (Admin)
router.put("/admin/:id/antecipar", autenticarToken, verificarAdmin, pedidoController.anteciparPedido);

// Listar todos os pedidos (Admin)
router.get("/admin", autenticarToken, verificarAdmin, pedidoController.listarTodosPedidosAdmin);

// Repor estoque (Admin/Superadmin)
router.post("/admin/repor", autenticarToken, verificarAdmin, pedidoController.reporEstoque);

// ========================
// Rotas de Cliente
// ========================

// Criar novo pedido (com regra de máximo 3 pedidos iniciados)
router.post("/", autenticarToken, pedidoController.cadastrarPedido);

// Listar pedidos do cliente logado
router.get("/", autenticarToken, pedidoController.listarPedidos);

// Histórico de pedidos do cliente
router.get("/historico", autenticarToken, pedidoController.historicoPedidos);

// Cancelar pedido
router.patch("/:id/cancelar", autenticarToken, pedidoController.cancelarPedido);

// Finalizar pedido
router.patch("/:id/finalizar", autenticarToken, pedidoController.finalizarPedido);

// Limpar pedidos do cliente logado
router.delete("/limpar", autenticarToken, pedidoController.limparPedidosCliente);

// ========================
// Rotas do MES
// ========================
router.put("/mes/:pedidoId/reordenar", autenticarToken, pedidoController.reordenarFilaMES);

// Callback de produção MES (baixa estoque e atualiza status)
router.post("/mes/callback", async (req, res) => {
  try {
    const { atualizarProducaoMES } = require('../services/mesService')
    const resultado = await atualizarProducaoMES(req.body)
    res.json(resultado)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no callback MES', erro: err.message })
  }
})

module.exports = router;

