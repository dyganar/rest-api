const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.cadastroUsuario = (request, response, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return response.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [request.body.email],
            (error, results) => {
                if(error){
                    return response.status(500).send({mensagem: error})
                }
                if(results.length > 0){
                    response.status(401).send({mensagem: 'Usuário já cadastrado'})
                } else {
                    bcrypt.hash(request.body.senha, 10, (errorBcrypt, hash) => {
                        if(errorBcrypt){
                            return response.status(500).send({error: errorBcrypt})
                        }
                        conn.query(
                            'INSERT INTO usuarios (email, senha) VALUES (?,?)', 
                            [request.body.email, hash],
                            (error, results) => {
                                conn.release()
                                if(error){return response.status(500).send({error:error})}
                                res = {
                                    mensagem: 'usuário criado com sucesso',
                                    usuarioCriado: {
                                        id_usuario: results.insertId,
                                        email: request.body.email,
                                    }
                                }
                                return response.status(201).send({res})
                            }
                        )
                    })
                }
            }
        )
    })
}

exports.loginUsuario = (request, response, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return response.status(500).send({error: error})
        }
        conn.query(
            'SELECT * FROM usuarios WHERE email =?',
            [request.body.email],
            (error, results, fields) => {
                conn.release()
                if(error){return response.status(500).send({error:error})}
                if(results.length < 1){
                    return response.status(401).send({       //se 404, possibilita tentativa e erro no email
                        mensagem:'Falha na autenticação'
                    })
                }
                bcrypt.compare(request.body.senha, results[0].senha, (error, result) => {
                    if(error){
                        return response.status(401).send({       //se 404, possibilita tentativa e erro no email
                        mensagem:'Falha na autenticação'
                        })
                    }
                    if(result){
                        const token = jwt.sign({
                            id_usuario: results[0].usuario,
                            email: results[0].email
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                        return response.status(200).send({
                            mensagem:'Autenticado com sucesso',
                            token: token
                        })
                    }
                    return response.status(401).send({       //se 404, possibilita tentativa e erro no email
                        mensagem:'Falha na autenticação'
                    })
                })
            }
        )
    })
}