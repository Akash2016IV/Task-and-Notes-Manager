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
        allowNull: false
    },
    due: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    priority: {
        type: Sequelize.STRING,
        defaultValue: 'medium',
        allowNull: false
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
        allowNull: false
    }
})

module.exports = {
    db, Tasks, Notes
}