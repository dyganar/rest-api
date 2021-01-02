/*
1. montar estrutura do server e app
2. montar rotas
3. tratar erros
4. tratar solicitações com bodyparser
5. CORS errors site acesse outro site com algumas restrições
*/

const express = require('express')  //estrutura
const app = express()               //estrutura
const morgan = require('morgan') //log
const bodyParser = require('body-parser') //corpo das requisições

const rotaProdutos = require('./routes/produtos')  //rotas
const rotaPedidos = require('./routes/pedidos')   //rotas

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Accept, Authorization, Content-Type')


    if (request.method === "OPTIONS") {
        request.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return response.status(200).send({})
    }
    next()
})
app.use('/produtos', rotaProdutos)  //rotas
app.use('/pedidos', rotaPedidos)    //rotas

app.use((request, response, next) => {   //estrutura
    const erro = new Error("Não encontrado")
    erro.status = 404
    next(erro)
})

app.use((error, request, response, next) => { //estrutura
    response.status(error.status || 500)
    return response.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app   //estrutura