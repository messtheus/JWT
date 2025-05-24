const Parse = require("parse/node");

async function CreateUsuario(dados) {

  const TabelaUsuarios = new Parse.User();
  console.log(dados);
  TabelaUsuarios.set("username", dados.nome);
  TabelaUsuarios.set("email", dados.email);
  TabelaUsuarios.set("password", dados.senha);

  try {

    const result = await TabelaUsuarios.save();
    
    console.log('Usuário ', dados.nome, ' salvo com sucesso!');
    return dados.nome

  } catch (error) {

    console.log('Erro ao salvar novo Usuário: ', error);
    return 'Erro ao salvar novo Usuário: ', error;

  }
}
async function ConsultarUsuario(dados) {

  const Usuario = Parse.Object.extend('Usuario');
  const query = new Parse.Query(Usuario);

   try {
    const results = await query.find();
    for (const object of results) {
      // Acessando os atributos do objeto Parse usando o método .GET
      const userName = object.get('userName')
      const userEmail = object.get('userEmail')
      const userPassword = object.get('userPassword')
      console.log(userName);
      console.log(userEmail);
      console.log(userPassword);
      return object;

    }
  } catch (error) {
    console.error('Erro ao buscar o Usuário', error);
  }

}








module.exports = { 
  CreateUsuario, 
  ConsultarUsuario
};