//Configurando o banco de dados

const Sequelize = require('sequelize');
const sequelize = new Sequelize('crud_node','root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3312',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    logging: false // para não aparecer o log do banco de dados
});

module.exports = {Sequelize, sequelize};
//testando a conecção

// sequelize.authenticate().then(() => {
//     console.log('O banco de dados foi conectado!');
// }).catch((erro) => {
//     console.log('Erro:' + erro);
// })