// 📂 routes/pedidos.js
const express = require("express");
const router = express.Router();

const autenticarToken = require('../middleware/auth');
const verificarAdmin = require('../middleware/verificarAdmin');
const verificarSuperAdmin = require('../middleware/verificarSuperAdmin');
const pedidoController = require("../controllers/pedidoController");

// ========================
// Rotas de Admin
// ========================

// Limpar todos os pedidos (Admin)
router.delete("/admin/limpar", autenticarToken, verificarAdmin, pedidoController.limparPedidos);

// Gerar balancete (Admin)
router.get("/admin/balancete", autenticarToken, verificarAdmin, pedidoController.gerarBalancete);

// Atualizar status de pedido (Admin → dispara CLP quando status = em_processamento)
router.put("/admin/:id/status", autenticarToken, verificarAdmin, pedidoController.atualizarStatusPedido);

// ========================
// Rotas de Cliente
// ========================

// Criar novo pedido
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
router.put("/mes/reordenar/:pedidoId", autenticarToken, pedidoController.reordenarFilaMES);

module.exports = router;
