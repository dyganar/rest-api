/*
1. criar rota
2. verificar se usuário já está cadastrado
3. biblioteca bcrypt (criptografar senhas)
4. cadastrar usuário
5. login e validação
6. token com jsonwebtoken
*/

const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')

router.post('/cadastro', usuariosController.cadastroUsuario)
router.post('/login', usuariosController.loginUsuario)

module.exports = router;