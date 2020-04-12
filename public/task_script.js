let title = document.getElementById('title')
let description = document.getElementById('description')
let dueDate = document.getElementById('dueDate')
let status = document.getElementById('status')
let priority = document.getElementById('priority')
let ul = document.getElementById('list')
let li=''

let submit = document.getElementById('submit');
submit.addEventListener('click',addTask);

window.onload = function(){
    dueDateSetter()
    getAllTasks()
}

async function getAllTasks() {
    let taskList = $('#taskList')
    taskList.empty()
    const resp = await fetch('/tasks', { method: 'GET' })
    await resp.json().then(taskData=>{
        taskData.forEach(element => {
            taskList.append(addTaskToPage(element))
        })
    }) 
}

function addTask(){
    let statusTask = false
    console.log(title.value, description.value, dueDate.value, status.value, priority.value)
    if(status.value === 'complete'){
        statusTask = true
    }
    addNewTaskJsonDB(title.value, dueDate.value, description.value, statusTask, priority.value)
    getAllTasks()
    title.value=''
    dueDateSetter()
    description.value=''
    status.value='incomplete'
    priority.value='medium'
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

  function addTaskToPage(task){
      let status = 'incomplete'
      if(task.status === true){
          status = 'complete'
      }
      return $(`      
      <div class="row border">
            <div class="col-sm border-right"> ${task.title}</div>
            <div class="col-sm border-right">${task.description}</div>
            <div class="col-sm border-right">${task.due}</div>
            <div class="col-sm border-right">${status}</div>
            <div class="col-sm border-right">${task.priority}</div>
            <div class="col-sm">
                <input class="btn-block" type="button" value="Update" id="update">
            </div>
        </div>
        </div>`
        )
  }

//   function addTaskToPage(element){
//     let textNode = document.createTextNode(element.title)
//           li = document.createElement('li')
//           let checkbox = document.createElement('input')
//           checkbox.type='checkbox'
//           checkbox.setAttribute('id','check')
//           let label = document.createElement('label')
//           label.setAttribute('for','taskItem')
//           ul.appendChild(label)
//           li.appendChild(checkbox)
//           label.appendChild(textNode)
//           li.appendChild(label)
//           ul.insertBefore(li,ul.childNodes[0])
//         //   setTimeout(()=>{
//         //       li.className='visual'
//         //     },2)
// }

function dueDateSetter(){
    const today = new Date()
    today.setDate(today.getDate()+1)
    dueDate.value = today.toISOString().split('T')[0]
}