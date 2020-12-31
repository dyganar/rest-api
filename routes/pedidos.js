const express = require('express')
const router = express.Router()

router.get('/', (request, response, next) => {
    response.status(200).send({
        mensagem: 'buscando todos pedidos'
    })
})

router.post('/', (request, response, next) => {
    const pedido = {
        id_produto: request.body.id_produto,
        quantidade: request.body.quantidade
    }
    response.status(201).send({
        mensagem: 'inserindo um pedindo',
        pedidoCriado: pedido
    })
})

router.get('/:id_pedido', (request, response, next) => {
    const id = request.params.id_pedido
    
    if (id === 'especial') {
        response.status(200).send({
            mensagem: 'seu pedido',
            id: id
        })
    } else {
        response.status(200).send({
            mensagem: 'pedido inexistente'
        })
    }
    
})

router.delete('/', (request, response, next) => {
    response.status(201).send({
        mensagem: 'Deletar pedido'
    })
})
module.exports = router