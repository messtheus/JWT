/* imports */
require('dotenv').config(0)
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Longin = require('./src/crud/Login.js')
const bd = require('./bd.js')

//Conecta ao BD
bd.conectarBd()

//Configuração do Express
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

    //Recebe os dados do corpo   
    const { nome, email, senha, confirmarSenha } = req.body
    //Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      return res.status(422).json({ error: 'Todos os campos são obrigatórios' })
    } else {
      let cod = await Longin.CreateUsuario(req.body)
      console.log(cod);
      //Usuario ja cadastrado
      if (cod == 1) {
        console.log('Usuário ', nome, ' já cadastrado!');
        res.status(422).json({ msg: 'Usuário ' + nome + ' já cadastrado!' })
      }
      //Sucesso
      else if (cod == 2) {
        console.log('Usuário ' + nome + ', salvo com sucesso!');
        res.status(201).json({ msg: 'Usuário ' + nome + ', salvo com sucesso!' })
      }
      //Erro
      else if (cod == 3) {
        console.log('Erro ao salvar novo Usuário, verifique as informações ou contate o suporte!');
        res.status(500).json({ msg: 'Erro ao salvar novo Usuário, verifique as informações ou contate o suporte!' })
      }
    }
  })



app.listen(3000)
