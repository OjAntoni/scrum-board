import TaskManager from "./TaskManager";

export const configureModalDefault = (modal, elementToOpen) => {
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

export const configureAddTaskModal = () => {
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
        let taskElement = TaskManager.createTaskElement(title, author, description);
        createModalForTask(taskElement);
        closeModal(modal);
        clearNewTaskForm();
    });
}

export const openModal = (modal) => {
    modal.style.display = "block";
    setTimeout(function() { // Timeout to allow the display change to take effect
        modal.style.opacity = 1;
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

export const closeModal = (modal) => {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
    modal.querySelector('.modal-content').style.opacity = 0;
    setTimeout(function() { // Timeout for the transition to finish before hiding
        modal.style.display = "none";
    }, 500);
}

export const clearNewTaskForm = () => {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
}

export const createModalForTask = (taskElement) => {
    let taskObj = TaskManager.getTaskById(TaskManager.parseIdFromTaskElement(taskElement));

    let taskModal = getHtmlForModal(taskObj);
    document.body.appendChild(taskModal);
    configureModalDefault(taskModal, taskElement);

    let btn = taskModal.querySelector(".task__remove-btn");
    btn.addEventListener('click', ()=>{
        TaskManager.removeTask(taskObj.id);
        closeModal(taskModal);
    })
}

const getHtmlForModal = (taskObj) => {
    let taskModal = document.createElement("div");
    taskModal.classList.add("modal");
    taskModal.id = TaskManager.getIdForTaskModal(taskObj.id);
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
    return taskModal;
}

