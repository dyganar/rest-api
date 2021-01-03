const http = require('http')   //estrutura
const port = process.env.PORT || 3000
const app = require('./app')
const server = http.createServer(app)
server.listen(port)
console.log('servidor online na porta: '+port)
