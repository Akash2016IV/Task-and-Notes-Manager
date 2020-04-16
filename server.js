const express = require('express')

const { db, Tasks, Notes } = require('./db')
const taskRoute = require('./route/taskNoteRoute')

const app = express()
const server_port = process.env.PORT || 6546

app.use(express.json())

app.use('/', express.static(__dirname + '/public'))

app.use('/tasks', taskRoute)

Tasks.hasMany(Notes, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync()
  .then(() => {
    app.listen(server_port)
  })
  .catch((err) => {
    console.error(err)
  })

