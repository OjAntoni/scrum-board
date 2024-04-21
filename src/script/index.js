import dragula from "dragula";

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

const getTaskById = (id) => {
    let find = tasks.find(task => task.id === Number.parseInt(id));
    return find ? find : null;
}

let drake = dragula(Array.from(document.querySelectorAll('.column__tasks-wrapper')));
drake.on('drop', (el, target, source, sibling) => {
    let foundTask = getTaskById(parseIdFromTaskElement(el));
    if(foundTask) foundTask.column = target.parentNode.id;
});

const getIdForTaskElement = id => `task_${id}`;
const getIdForTaskModal = id => `taskModal_${id}`;
const parseIdFromTaskElement = taskElement => taskElement.id.split('_')[1];

const createTaskElement = (title, author, description) => {
    let newTask = {
        id: Math.trunc(Math.random()*10000),
        title: title,
        author: author,
        description: description,
        date: Date.now(),
        column: 'todo'
    }

    tasks.push(newTask)

    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.id = getIdForTaskElement(newTask.id);
    taskElement.innerHTML = `
                <div class="task__header-wrapper">
                    <h3 class="task__title">
                        ${newTask.title}
                    </h3>
                    <p class="task__author">
                        ${newTask.author}
                    </p>
                </div>
                <p class="task__description">
                    ${newTask.description}
                </p>
                <p class="task__date">
                    ${new Date(newTask.date).toDateString()}
                </p>
    `
    document.querySelector('.column__tasks-wrapper').appendChild(taskElement);

    return taskElement;
}

const configureModalDefault = (modal, elementToOpen) => {
    let span = modal.getElementsByClassName("close")[0];

    elementToOpen.onclick = function() {
        openModal(modal);
    }

    span.onclick = function() {
        closeModal(modal);
        clearNewTaskForm();
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal(modal);
            clearNewTaskForm();
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === "Escape") { // Check if the pressed key is "Escape"
            closeModal(modal);
            clearNewTaskForm();
        }
    })
}

const configureAddTaskModal = () => {
    let modal = document.getElementById('newTaskModal');
    let btn = document.getElementById('addTaskBtn');

    configureModalDefault(modal, btn);

    btn.addEventListener("click", ()=>{
        clearNewTaskForm();
    })

    let form = document.querySelector('.task-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let description = document.getElementById('description').value;
        let date = document.getElementById('date').value;
        let taskElement = createTaskElement(title, author, description);
        createModalForTask(taskElement);
        closeModal(modal);
        clearNewTaskForm();
    });
}

configureAddTaskModal();

const openModal = (modal) => {
    modal.style.display = "block";
    setTimeout(function() { // Timeout to allow the display change to take effect
        modal.style.opacity = 1;
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

const closeModal = (modal) => {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
    modal.querySelector('.modal-content').style.opacity = 0;
    setTimeout(function() { // Timeout for the transition to finish before hiding
        modal.style.display = "none";
    }, 500);
}

const clearNewTaskForm = () => {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
}

const removeTask = (id) => {
    let taskId = Number.parseInt(id);
    let taskModal = document.querySelector(`#${getIdForTaskModal(taskId)}.modal`);
    let taskElement = document.querySelector(`#${getIdForTaskElement(taskId)}.task`);

    if(taskModal) taskModal.remove();
    if(taskElement) taskElement.remove();

    let taskById = getTaskById(taskId);
    let index = tasks.findIndex(task => task.id === taskId);
    if (index > -1) {
        tasks.splice(index, 1);
    }

}
const createModalForTask = (taskElemnt) => {
    let taskObj = getTaskById(parseIdFromTaskElement(taskElemnt));
    let taskModal = document.createElement("div");
    taskModal.classList.add("modal");
    taskModal.id = getIdForTaskModal(taskElemnt.id);
    taskModal.innerHTML = `
    <div class="modal-content">
        <span class="close">&times;</span>
        <div class="task">
            <div class="task__header-wrapper">
                <h3 class="task__title">
                    ${taskObj.title}
                </h3>
                <p class="task__author">
                    ${taskObj.author}
                </p>
            </div>
            <p class="task__description">
                ${taskObj.description}
            </p>
            <p class="task__date">${new Date(taskObj.date).toDateString()}</p>
            <button class="task__remove-btn btn">Remove</button>
        </div>
    </div>
    `
    document.body.appendChild(taskModal);
    configureModalDefault(taskModal, taskElemnt);

    let btn = taskModal.querySelector(".task__remove-btn");
    btn.addEventListener('click', ()=>{
        removeTask(taskObj.id);
        closeModal(taskModal);
    })
}

const renderTasks = () => {
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.id = getIdForTaskElement(task.id);
        taskElement.innerHTML = `
                <div class="task__header-wrapper">
                    <h3 class="task__title">
                        ${task.title}
                    </h3>
                    <p class="task__author">
                        ${task.author}
                    </p>
                </div>
                <p class="task__description">
                    ${task.description}
                </p>
                <p class="task__date ">
                    ${new Date(task.date).toDateString()}
                </p>`
        document.querySelector(`#${task.column} .column__tasks-wrapper`)?.appendChild(taskElement);
        createModalForTask(taskElement);
})};
renderTasks();

window.addEventListener('beforeunload', () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
})


