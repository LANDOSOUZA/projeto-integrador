// statusRouter.js
const express = require('express')
const router = express.Router()
const { lerStatus } = require('../controllers/statusController')
const autenticarToken = require('../middleware/auth')

router.get('/', autenticarToken, lerStatus)

module.exports = router
