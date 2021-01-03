const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const pedidosController = require('../controllers/pedidosController')

router.get('/', pedidosController.getPedidos)

router.post('/', login, pedidosController.postPedidos)

router.get('/:id_pedido', pedidosController.getPedidosEspecificos)

router.patch('/', pedidosController.patchPedidos)

router.delete('/', pedidosController.deletePedidos)

module.exports = router