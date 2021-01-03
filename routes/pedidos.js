const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const login = require('../middleware/login')

router.get('/', (request, response, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return response.status(500).send({
                error: error,
                mensagem:'Erro de conexão'
            })
        }
        conn.query(
            'SELECT pedidos.id_pedido, pedidos.quantidade, produtos.nome, produtos.preco from pedidos INNER JOIN produtos ON produtos.id_produto = pedidos.id_produto',
            (error, result, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        response: null
                    })
                }
                const res = {
                    quantidade: result.length,
                    pedidos: result.map(prod => {
                        return {
                            id_pedido: prod.id_pedido,
                            quantidade: prod.quantidade,
                            produto: {
                                nome: prod.nome,
                                preco: prod.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna detalhes do pedido',
                                url: 'http://'+'10.0.0.107:3000'+'/pedidos/'+prod.id_pedido
                            }
                        }
                    })
                }
                response.status(200).send({
                    res
                })
                conn.release()
            }
        )
    })
})

router.post('/', login, (request, response, next) => {

    /*const pedido = {
        id_pedido: request.body.id_pedido,
        quantidade: request.body.quantidade
    }
    response.status(201).send({
        mensagem: 'pedido inserido com sucesso',
        id_pedido: pedido
    })*/
    mysql.getConnection((error, conn) => {
        if(error){
            return response.status(500).send({
                error: error,
                mensagem: 'Erro de conexão'
            })
        }
        conn.query('SELECT pedidos.id_pedido, pedidos.quantidade, produtos.nome, produtos.preco FROM pedidos WHERE id_produto = ?',
        [request.body.id_produto],
        (error, result, field) => {
            if(error){
                return response.status(500).send({
                    error: error
                })
            }
            if(result.length == 0){
                return response.status(404).send({
                    mensagem: 'Produto não encontrado'
                })
            }
            conn.query(
                'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                [request.body.id_produto, request.body.quantidade],
                (error, result, field) => {
                    if(error){
                        conn.release()
                        return response.status(500).send({
                            error: error,
                            response: null
                        })
                    }
                    const res = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado: {
                            id_pedido: result.id_pedido,
                            id_pedido: request.body.id_pedido,
                            quantidade: request.body.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://'+'10.0.0.107:3000'+'/pedidos'
                            }
                        }
                    }
                    response.status(201).send({
                        res
                    })
                    conn.release()
                }
            )
        })
    })
})

router.get('/:id_pedido', (request, response, next) => {
    const id = request.params.id_pedido
    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'SELECT * from pedidos INNER JOIN produtos ON produtos.id_produto = pedidos.id_produto WHERE id_pedido=?;',
            [id],
            (error, result, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        mensagem: 'erro na query'
                    }) 
                }
                if(result[0] != undefined){
        
                    const res = {
                        pedido: {
                            id_pedido: result[0].id_pedido,
                            quantidade: result[0].quantidade,
                            produto: {
                                nome: result[0].nome,
                                preco: result[0].preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://'+'10.0.0.107:3000'+'/pedidos'
                            }
                        }
                    }
                    response.status(201).send({
                       res
                    })

                } else {
                    response.status(200).send({
                        mensagem:'Pedido não encontrado'
                    })
                }
                
                conn.release()
            }
        )
    })
})

router.patch('/', (request, response, next) => {
    const id_pedido = request.body.id_pedido
    const id_produto = request.body.id_produto
    const quantidade = request.body.quantidade

    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'UPDATE pedidos SET id_pedido = ?, quantidade = ? WHERE id_pedido = ?',
            [id_pedido, quantidade, id_pedido],
            (error, resultado, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        mensagem: 'erro na query'
                    }) 
                }
                const res = {
                    mensagem: 'Pedido atualizado com sucesso',
                    pedidoAtualizado: {
                        id_pedido: request.body.id_pedido,
                        id_produto: request.body.id_produto,
                        quantidade: request.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes do pedido',
                            url: 'http://'+'10.0.0.107:3000'+'/pedidos/'+request.body.id_pedido
                        }
                    }
                }
                response.status(202).send({
                   res
                })
                conn.release()
            }
        )
    })
})

router.delete('/', (request, response, next) => {
    const id = request.body.id_pedido
    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido=?;',
            [id],
            (error, result, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        mensagem:'erro na query'
                    })
                }
                if(result.affectedRows === 0){
                    response.status(200).send({
                        mensagem:'registro não encontrado'
                    })
                }else{
                    const res = {
                        mensagem: 'pedido removido com sucesso',
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um pedido',
                            url: 'http://localhost:3000/pedidos',
                            body: {
                                id_produto: 'number',
                                quantidade: 'number'
                            }
                        }
                    }
                    response.status(202).send({
                        res
                    })
                }
                conn.release()

            }
        )
    })
})

module.exports = router