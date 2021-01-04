const mysql = require('../mysql').pool

exports.getProdutos = (request, response, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return response.status(500).send({
                error: error,
                mensagem: 'Erro de conexão'
            })
        }
        conn.query(
            'SELECT * from produtos',
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
                    produtos: result.map(prod => {
                        console.log(prod)
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna detalhes do produto',
                                url: 'http://'+'10.0.0.107:3000'+'/produtos/'+prod.id_produto
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
    
}

exports.postProdutos = (request, response, next) => {
    console.log(request.file)
    
    mysql.getConnection((error, conn) => {
        if(error){
            return response.status(500).send({
                error: error,
                mensagem: 'Erro de conexão'
            })
        }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [request.body.nome, request.body.preco, request.file.path],
            (error, result, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        response: null
                    })
                }
                const res = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: request.body.nome,
                        preco: request.body.preco,
                        produtoImagem: request.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://'+'10.0.0.111:3000'+'/produtos'
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
}

exports.getProdutoEspecifico = (request, response, next) => {
    const id = request.params.id_produto
    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'SELECT * FROM produtos WHERE id_produto=?;',
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
                        produto: {
                            id_produto: result[0].id_produto,
                            nome: result[0].nome,
                            preco: result[0].preco,
                            imagem_produto: result[0].imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://'+'10.0.0.107:3000'+'/produtos'
                            }
                        }
                    }
                    response.status(201).send({
                       res
                    })

                } else {
                    response.status(404).send({
                        mensagem:'Produto não encontrado'
                    })
                }
                
                conn.release()
            }
        )
    })
    
    /*if (id === 'especial') {
        response.status(200).send({
            mensagem: 'produto específico ',
            id: id
        })
    } else {
        response.status(200).send({
            mensagem: 'produto não encontrado'
        })
    }*/
    
}

exports.patchProdutos = (request, response, next) => {
    const id = request.body.id_produto
    const nome = request.body.nome
    const preco = request.body.preco
    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [nome, preco, id],
            (error, result, field) => {
                if(error){
                    conn.release()
                    return response.status(500).send({
                        error: error,
                        mensagem: 'erro na query'
                    }) 
                }
                const res = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: request.body.id_produto,
                        nome: request.body.nome,
                        preco: request.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna detalhes do produto',
                            url: 'http://'+'10.0.0.107:3000'+'/produtos/'+request.body.id_produto
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
}

exports.deleteProdutos = (request, response, next) => {
    const id = request.body.id_produto
    mysql.getConnection((error, conn) => {
        if(error){
            return response.send({
                error: error,
                mensagem: 'erro de conexão'
            })
        }
        conn.query(
            'DELETE FROM produtos WHERE id_produto=?;',
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
                    response.status(404).send({
                        mensagem:'registro não encontrado'
                    })
                }else{
                    const res = {
                        mensagem: 'produto removido com sucesso',
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/produtos',
                            body: {
                                nome: 'string',
                                preco: 'number'
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
}