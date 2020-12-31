const express = require('express')
const router = express.Router()

router.get('/', (request, response, next) => {
    response.status(200).send({
        mensagem: 'buscando todos produtos'
    })
})

router.post('/', (request, response, next) => {
    
    const produto = {
        nome: request.body.nome,
        preco: request.body.preco
    }
    
    response.status(201).send({
        mensagem: 'inserindo produtos',
        produtoCriado: produto
    })
})

router.get('/:id_produto', (request, response, next) => {
    const id = request.params.id_produto
    
    if (id === 'especial') {
        response.status(200).send({
            mensagem: 'produto específico ',
            id: id
        })
    } else {
        response.status(200).send({
            mensagem: 'produto não encontrado'
        })
    }
    
})

router.patch('/', (request, response, next) => {
    response.status(201).send({
        mensagem: 'Alterando produto'
    })
})

router.delete('/', (request, response, next) => {
    response.status(201).send({
        mensagem: 'Deletando produto'
    })
})
module.exports = router