const Parse = require('parse/node')

const applicationId = process.env.BD_APP;
const apiKey = process.env.BD_APIKEY;

async function conectarBd() {

//Configuração do Back4App
try{
    await Parse.initialize(applicationId, apiKey);
    console.log('Conectado ao Back4App com sucesso!');
} catch (error) {
    console.error('Erro ao conectar ao Back4App:', error);
}
//Apontar para o endereço da API de análise do Back4App
Parse.serverURL = 'https://parseapi.back4app.com'

}

module.exports = { conectarBd }