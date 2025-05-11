/* imports */
require('dotenv').config(0)
const express = require('express')

const app = express();

//Configuração JSON response
app.use(express.json());

//Rotas

//Rota inicial
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

//Rota de Registro
app.post('/auth/registro', async (req, res) => {

    const { nome, email, senha, confirmarSenha } = req.body

    if (!nome || !email || !senha || !confirmarSenha) {
        return res.status(422).json({ error: 'Todos os campos são obrigatórios' })
    }

    res.status(200).json({ msg: 'sucesso' })

})

app.listen(3000)