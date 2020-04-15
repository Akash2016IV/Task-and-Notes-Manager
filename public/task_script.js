let title = document.getElementById('title')
let description = document.getElementById('description')
let dueDate = document.getElementById('dueDate')
let status = document.getElementById('status')
let priority = document.getElementById('priority')
let filterTask = document.getElementById('filterTask')
let applyFilter = document.getElementById('filter')

let submit = document.getElementById('submit')
submit.addEventListener('click', addTask)
applyFilter.addEventListener('click',getAllTasks)

window.onload = function () {
    dueDateSetter()
    getAllTasks()
}

async function getAllTasks() {
    let taskList = $('#taskList')
    taskList.empty()
    const resp = await fetch('/tasks', { method: 'GET' })
    await resp.json().then(taskData => {
        switch (filterTask.value) {
            case 'ascending':
                taskData.sort((a, b) => (a.due > b.due) ? 1 : -1)
                break
            case 'descending':
                taskData.sort((a, b) => (a.due < b.due) ? 1 : -1)
                break
            case 'priority':
                taskData.sort((a, b) => Number(b.priority)-Number(a.priority))
                break
            case 'status':
                taskData.sort((a, b) => Number(a.status)-Number(b.status))
                break
        }
        taskData.forEach(element => {
            taskList.append(addTaskToPage(element))
        })
    })
}

function addTask() {
    let statusTask = false
    if (status.value === 'complete') {
        statusTask = true
    }
    let priorityTask = 2
    if (priority.value === 'high') {
        priorityTask = 3
    } else if (priority.value === 'low') {
        priorityTask = 1
    }
    addNewTaskJsonDB(title.value, dueDate.value, description.value, statusTask, priorityTask)
    getAllTasks()
    title.value = ''
    dueDateSetter()
    description.value = ''
    status.value = 'incomplete'
    priority.value = 'medium'
}

async function addNewTaskJsonDB(title, due, description, status, priority) {
    const resp = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, due, description, status, priority })
    })
}

function addTaskToPage(task) {
    let status = 'incomplete'
    if (task.status === true) {
        status = 'complete'
    }
    let priorityTask = 'medium'
    if (task.priority === 3) {
        priorityTask = 'high'
    } else if (task.priority === 1) {
        priorityTask = 'low'
    }
    return $(`
    <div>      
      <div class="row border" id=${task.taskId} onclick = "getAllTasksNotes(${task.taskId})">
            <div class="col-sm border-right"> ${task.title}</div>
            <div class="col-sm border-right">${task.description}</div>
            <div class="col-sm border-right">${task.due}</div>
            <div class="col-sm border-right">${status}</div>
            <div class="col-sm border-right">${priorityTask}</div>
            <div class="col-sm">
                <input class="btn-block" type="button" value="Update" id="update" onclick = "updateTaskDetail(${task.taskId})" >
            </div>
        </div>
        <div id="${task.taskId}notesList">
        </div>
        <br>`
    )
}

async function getAllTasksNotes(taskId) {
    let notesList = document.getElementById(`${taskId}notesList`)
    notesList.innerHTML = ''
    const resp = await fetch(`/tasks/${taskId}/notes`, { method: 'GET' })
    await resp.json().then(taskData => {
        taskData.All_Notes.forEach(note => {
            let data = document.createElement('li')
            data.innerText = note.text
            notesList.appendChild(data)
        })
    })
    let divElement = document.createElement('div')
    divElement.setAttribute('id', `${taskId}div`)
    let noteData = document.createElement('input')
    noteData.setAttribute('type', 'text')
    noteData.setAttribute('id', `${taskId}noteData`)
    let add = document.createElement('input')
    add.setAttribute('type', 'button')
    add.setAttribute('value', 'Add New Note')
    add.setAttribute('onclick', `AddNewNoteToTask(${taskId})`)
    divElement.appendChild(noteData)
    divElement.appendChild(add)
    notesList.appendChild(divElement)
}

function AddNewNoteToTask(taskId) {
    let noteData = document.getElementById(`${taskId}noteData`)
    addNewNoteToTaskDb(taskId, noteData.value).then(() => {
        getAllTasksNotes(taskId)
    })
}

async function addNewNoteToTaskDb(taskId, noteData) {
    const resp = await fetch(`/tasks/${taskId}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: noteData })
    })
}

function updateTaskDetail(taskId) {
    getTaskWithId(taskId).then((task) => {
        sessionStorage.setItem('task', JSON.stringify(task))
        location.replace("taskUpdate.html")
    })

}

async function getTaskWithId(taskId) {
    const resp = await fetch(`/tasks/${taskId}`, { method: 'GET' })
    const task = await resp.json()
    return task
}

function dueDateSetter() {
    const today = new Date()
    today.setDate(today.getDate() + 1)
    dueDate.value = today.toISOString().split('T')[0]
}
