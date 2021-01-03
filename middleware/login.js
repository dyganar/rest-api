const { JsonWebTokenError } = require("jsonwebtoken");

/*
1. validação do token gravado no sistema / proteção de acesso às rotas
*/
const jwt = require('jsonwebtoken')

module.exports=(request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        request.usuario = decode
        next()
    } catch (error) {
        return response.status(401).send({mensagem: 'Falha na autenticação'})
    }
}
/*
exports.obrigatorio=(request, response, next) => {  //quando for obrigatório a verificação de token
    try {
        const token = request.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        request.usuario = decode
        next()
    } catch (error) {
        return response.status(401).send({mensagem: 'Falha na autenticação'})
    }
}
exports.opcional=(request, response, next) => {   //quando não for obrigatório
    try {
        const token = request.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        request.usuario = decode
        next()
    } catch (error) {
        next()
    }
}*/