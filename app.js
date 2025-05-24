/* imports */
require('dotenv').config(0)
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Longin = require('./src/crud/Login')
const bd = require('./bd.js')

//Conecta ao BD
bd.conectarBd()

//Configuração do Express
const app = express();

//Configuração JSON response
app.use(express.json());

//Rotas Publicas

  //Rota de Registro - Cria um novo usuário
  app.post('/auth/registro', async (req, res) => {

    //Recebe os dados do corpo   
    const { nome, email, senha, confirmarSenha } = req.body
    //Verifica se todos os campos foram preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      return res.status(422).json({ error: 'Todos os campos são obrigatórios' })
    } else if (senha != confirmarSenha) {
      return res.status(422).json({ error: 'As senhas devem ser iguais' })}
    //Cria o usuário no BD
    else {
      //Cria password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(senha, salt);

  
      let cod = await Longin.CreateUsuario({nome, email, passwordHash});
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
  //Rota de Login
  app.post('/auth/login', async (req, res) => {

    //Recebe os dados do corpo   
    const { email, senha } = req.body
    //Verifica se todos os campos foram preenchidos
    if (!email || !senha) {
      return res.status(422).json({ error: 'Todos os campos são obrigatórios' })
    }
    else {
      //Checa se o usuário já é cadastrado
      const UsuarioExistente = (await Longin.ConsultarUsuarioExistente(email));

      //Usuario não cadastrado
      if (!UsuarioExistente.Resultado) {
        console.log('Usuário ', email, ' não cadastrado!');
        res.status(404).json({ msg: 'Usuário ' + email + ' nao cadastrado!' })
      
      }
      //checa senha
      else if (!await bcrypt.compare(senha, UsuarioExistente.userSenha)) {
        console.log('Senha incorreta!');
        res.status(422).json({ msg: 'Senha incorreta!' })
      }
      //Sucesso
      else {
        try{
          const secret = process.env.SECRET;
          const userId = UsuarioExistente.userId
          const token = jwt.sign(
            {
            id: userId
            }, 
            secret);

            res.status(200).json({ msg: 'Usuário ' + email + ', logado com sucesso!', token, user: userId });

          console.log(token);
0
        }catch(error){
          console.log('Erro ao logar Usuário, verifique as informações ou contate o suporte!');
          res.status(500).json({ msg: 'Erro ao logar Usuário, verifique as informações ou contate o suporte!' })
        }
      }
    }
  })

  //Rotas Privadas

    //Rota Salvar Dados
    app.get('/user/dados', checkToken, async (req, res) => {
      res.status(200).json({ msg: 'Dados salvos com sucesso!' })
    })

    //Rota deletar Usuário
    app.delete('/user/deletaruser', checkToken, async (req, res) => {

      const {userId} = req.body
      const result = await Longin.DeletarUser(userId)
      res.status(result.status).json({ msg: result.msg })
      
    })

/**
 * Middleware responsavel por verificar se o token
 * passado na requisição esta valido e permitir o acesso
 * a rotas privadas.
 */
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return res.status(401).json({ msg: 'Acesso negado' });
    }
      try{
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();

        }catch(error){
          return res.status(403).json({ msg: 'Token invalido' });

        } 
  }


app.listen(3000)
