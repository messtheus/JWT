const Parse = require("parse/node");

async function CreateUsuario(dados) {

    if (await ConsultarUsuarioExistente(dados)) {
      return 1
    }else{
      const TabelaUsuarios = new Parse.Object('Usuario');
      console.log(dados);
      TabelaUsuarios.set("userName", dados.nome);
      TabelaUsuarios.set("userEmail", dados.email);
      TabelaUsuarios.set("userPassword", dados.passwordHash);

      try {
            const result = await TabelaUsuarios.save();
            
            console.log('sucesso!');
            return 2

          } catch (error) {
                          console.log('Erro: ', error);
                          return 3
                          }
    }
}

async function ConsultarUsuarioExistente(dados) {
  
  //const Usuario = Parse.Object.extend("Usuario");
  const query = new Parse.Query('Usuario');
  query.equalTo("userEmail", dados);
  const result = await query.first();
  const userSenha = result.get('userPassword');
  const userId = result.id;

  if (result) {
    
    const Resultado = true;
    return {Resultado, userSenha, userId};
  } else {
    const Resultado = false
    return {Resultado}
  }
}


module.exports = { 
  CreateUsuario, 
  ConsultarUsuarioExistente
  };