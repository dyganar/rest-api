const express = require('express')
const router = express.Router()
const login = require('../middleware/login')
const produtosController = require('../controllers/produtosController')

router.get('/', produtosController.getProdutos)

router.post('/', login, produtosController.postProdutos)

router.get('/:id_produto', produtosController.getProdutoEspecifico)

router.patch('/', login, produtosController.patchProdutos)

router.delete('/', login, produtosController.deleteProdutos)
module.exports = router