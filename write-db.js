const { db, Tasks, Notes } = require('./db')

Tasks.hasMany(Notes, { as: 'All_Notes', foreignKey: 'taskId' })
db.sync().then(() => {
    Tasks.create({
        title: 'MVC Assignment',
        description: 'Final Assignment',
        due: '2020-04-13',
        status: false,
        priority: 'high'
    })
}).then(() => {
    Notes.create({
        taskId: 1,
        text: 'Assignment'
    })
}).catch((err) => {
    console.error(err)
})