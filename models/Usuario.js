const db = require('./db.js');

const Usuario = db.sequelize.define('usuario', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

Usuario.sync(); //se não existir esta tabela ele irá criar

module.exports = Usuario;