const { Router } = require('express')
const { Notes, Tasks } = require('../db')

const route = Router()

//to get all tasks in array
route.get('/', async (req, res) => {
    const tasks = await Tasks.findAll()
    res.send(tasks)
})

//to get task details of a particular id
route.get('/:id', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    const task = await Tasks.findByPk(req.params.id)

    if (!task) {
        return res.status(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }
    res.send(task)
})

//to add a new task
route.post('/', async (req, res) => {
    const newTask = await Tasks.create({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due,
        status: req.body.status,
        priority: req.body.priority
    })
    res.status(201).send({ success: 'New task added', data: newTask })
})

//update details of a task with particular id
route.patch('/:id', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    Tasks.update({
        title: req.body.title,
        description: req.body.description,
        due: req.body.due,
        status: req.body.status,
        priority: req.body.priority
    },
        {
            where: {
                taskId: req.params.id
            }
        }).then(rows => {
            res.json(rows)
        }).catch(error => {
            console.error(error)
            res.status(404).send(error)
        })
})

// get list of all notes under task with id
route.get('/:id/notes', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer',
        })
    }
    const task = await Tasks.findByPk(req.params.id, {
        include: [{
            model: Notes,
            as: 'All_Notes',
            attributes: ['noteId', 'text']
        }]
    })

    if (!task) {
        return res.status(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }
    res.send(task)
})

// to add notes corresponding to task id
route.post('/:id/notes', async (req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'todo id must be an integer',
        })
    }
    const task = await Tasks.findByPk(req.params.id)
    if (!task) {
        return res.status(404).send({
            error: 'No task found with id = ' + req.params.id,
        })
    }
    const newNote = await Notes.create({
        taskId: req.params.id,
        text: req.body.text
    })
    res.status(201).send({ success: 'New task added', data: newNote })
})

module.exports = route
