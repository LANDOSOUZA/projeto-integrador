// relatorioRouter.js
const express = require('express')
const router = express.Router()
const { getRelatorio } = require('../controllers/relatorioController')
const autenticarToken = require('../middleware/auth')

router.get('/:periodo', autenticarToken, getRelatorio)

module.exports = router
