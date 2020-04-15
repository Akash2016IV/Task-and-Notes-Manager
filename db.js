const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/taskNoteMgr.db'
})

const Tasks = db.define('Task', {
    taskId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    due: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
            isBoolean: true
        }
    },
    priority: {
        type: Sequelize.NUMBER,
        defaultValue: 2,
        allowNull: false,
        validate: {
            isIn: [[1, 2, 3]]
        }
    }
})

const Notes = db.define('Note', {
    noteId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate:{
            notEmpty : true
        }
    }
})

module.exports = {
    db, Tasks, Notes
}