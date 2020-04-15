const express = require('express')

const { db, Tasks, Notes } = require('./db')
const taskRoute = require('./route/taskNoteRoute')

const app = express()
app.use(express.json())

app.use('/', express.static(__dirname + '/public'))

app.use('/tasks', taskRoute)

Tasks.hasMany(Notes, { as: 'All_Notes', foreignKey: 'taskId' })

db.sync()
  .then(() => {
    app.listen(6543)
  })
  .catch((err) => {
    console.error(err)
  })
