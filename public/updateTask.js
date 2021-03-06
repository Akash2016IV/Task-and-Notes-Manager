let task = JSON.parse(sessionStorage.getItem('task'))
let title = document.getElementById('title')
let description = document.getElementById('description')
let dueDate = document.getElementById('dueDate')
let status = document.getElementById('status')
let priority = document.getElementById('priority')

let update = document.getElementById('update')
update.addEventListener('click', updateTask)

window.onload = function () {
    if (task.status === true) {
        status.checked = true
    }
    let priorityTask = 'medium'
    if(task.priority === 3){
        priorityTask = 'high'
    } else if(task.priority === 1){
        priorityTask = 'low'
    }
    title.value = task.title
    description.value = task.description
    dueDate.value = task.due
    priority.value = priorityTask
}

function updateTask() {
    let statusTask = false
    if (status.checked) {
        statusTask = true
    }
    let priorityTask = 2
    if(priority.value === 'high'){
        priorityTask = 3
    } else if(priority.value === 'low'){
        priorityTask = 1
    }
    updateTaskDetails(task.taskId,dueDate.value,statusTask,priorityTask).then(()=>{
        location.href="index.html"
    })
}

async function updateTaskDetails(taskId, due, status, priority) {
    const resp = await fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ due, status, priority })
    })
}