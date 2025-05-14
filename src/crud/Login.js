const Parse = require("parse/node");

/**
 * Cria um novo usuário no banco de dados.
 *
 * Esta função verifica se um usuário com o email fornecido já existe. 
 * Se o usuário já estiver cadastrado, retorna 1. Caso contrário, cria
 * um novo usuário na tabela 'Usuario' com o nome, email e senha fornecidos.
 * Retorna 2 em caso de sucesso na criação do usuário. Se ocorrer um erro durante
 * o processo de criação, captura o erro e retorna 3.
 *
 * @param {Object} dados - Um objeto contendo o nome, email e passwordHash do usuário.
 * @returns {Promise<number>} - Retorna 1 se o usuário já existir, 2 se for criado com 
 * sucesso, ou 3 se houver um erro durante a criação.
 */
async function CreateUsuario(dados) {
  console.log('function CreateUsuario');
  if ((await ConsultarUsuarioExistente(dados.email)).Resultado) {
    return 1
  } else {
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

/**
 * Consulta se um usuário existe no banco de dados.
 *
 * Esta função verifica se existe um usuário na tabela 'Usuario' com o email fornecido.
 * Se encontrado, retorna um objeto contendo o status do resultado, a senha do usuário e o ID do usuário.
 * Caso contrário, retorna um objeto indicando que o usuário não foi encontrado.
 *
 * @param {string} dados - O email do usuário a ser consultado.
 * @returns {Promise<{Resultado: boolean, userSenha?: string, userId?: string}>} - Um objeto com o resultado da consulta,
 * a senha do usuário e o ID do usuário, se encontrado.
 */
async function ConsultarUsuarioExistente(email) {
  console.log('function ConsultarUsuarioExistente');

  const query = new Parse.Query('Usuario');
  query.equalTo("userEmail", email);

  const result = await query.first();
  console.log(result);
  if (result) {
    const userSenha = result.get('userPassword');
    const userId = result.id;
    const Resultado = true;
    return { Resultado, userSenha, userId };
  } else {
    const Resultado = false
    return { Resultado }
  }

}

/**
* Exclui um usuário do banco de dados.
*
* Esta função tenta encontrar um usuário pelo userId e excluí-lo da tabela 'Usuario'.
* Se for bem-sucedida, ela registra e retorna uma mensagem de sucesso. Se ocorrer um erro durante o processo,
* ela captura e registra o erro, retornando uma mensagem de erro e o status apropriados.
*
* @throws Lançará um erro se houver um problema ao recuperar ou excluir o usuário.
*/
async function DeletarUser(userId) {

  const query = new Parse.Query('Usuario');
  try {
    const object = await query.get(userId);
    try {
      const response = await object.destroy();
      console.log('Usuário deletado', response);
      return { msg: 'Usuário deletado', status: 200 }
    } catch (error) {
      console.error('Error ao deletar usuario', error);
      return { msg: 'Error ao deletar usuario', status: 404 }
    }
  } catch (error) {
    console.error('Erro ao recuperar usuario', error);
    return { msg: 'Erro ao recuperar usuario', status: 404 }
  }
}

module.exports = {
  CreateUsuario,
  ConsultarUsuarioExistente,
  DeletarUser
};