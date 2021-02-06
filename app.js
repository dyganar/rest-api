const express = require('express');
const app = express();
const port = 3000;
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

userRoute(app);

app.listen(port, () => {
    console.log('porta rodando na porta 3000');
})

app.get('/', (request, response, next) =>{
    response.status(200).send({
        mensagem:'tudo certo'
    });
});

