import TaskManager from "./TaskManager";
import {COLORS} from "./colors"

export function configureDeleteAllModal() {
    let deleteAllSpan = document.querySelector('#done .close');
    let modal = document.getElementById('deleteAllModal');
    configureModalDefault(modal, deleteAllSpan);

    modal.querySelector('.remove-btn').addEventListener('click', () => {
        document.querySelectorAll('#done .task').forEach(task => {
            TaskManager.removeTask(TaskManager.parseIdFromTaskElement(task));
        })
        TaskManager.renderColumnCounter("done");
        closeModal(modal);
    })

    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        closeModal(modal);
    });

}


export const configureModalDefault = (modal, elementToOpen) => {
    let span = modal.getElementsByClassName("close")[0];

    elementToOpen.onclick = function() {
        if(modal.querySelector('.modal__author select '))
            fetchUsersAndPopulateSelect(modal.querySelector('.modal__author select')).then(r => {} )
        openModal(modal);
    }

    span.onclick = function() {
        closeModal(modal);
    }

    const isClickOnMargin = (event) => {
        const target = event.target;
        const rect = modal.getBoundingClientRect();
        const isClickOnMarginX = event.clientX < rect.left || event.clientX > rect.right;
        const isClickOnMarginY = event.clientY < rect.top || event.clientY > rect.bottom;
        return isClickOnMarginX || isClickOnMarginY;
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal || isClickOnMargin(event)){
            closeModal(modal);
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === "Escape") { // Check if the pressed key is "Escape"
            closeModal(modal);
        }
    })
}



export const configureAddTaskModal = () => {
    let modal = document.getElementById('newTaskModal');
    let btn = document.getElementById('addTaskBtn');
    let select = modal.querySelector('.author');
    fetchUsersAndPopulateSelect(select).then(r => {} )
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
        let taskElement = TaskManager.createTaskElement(title, author, description, date);
        createModalForTask(taskElement);
        closeModal(modal);
        clearNewTaskForm();
        TaskManager.renderColumnCounter("todo")
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

    taskModal.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.parentElement;
            const valueSpan = field.querySelector('.value');
            const editInput = field.querySelector('.edit-input');
            // Display edit input and hide value span
            valueSpan.style.display = 'none';
            editInput.style.display = 'block';
            editInput.value = valueSpan.textContent;
            editInput.focus();
        });
    });

    taskModal.querySelectorAll('.edit-input').forEach(input => {
        input.addEventListener('blur', () => {
            const field = input.parentElement;
            const valueSpan = field.querySelector('.value');
            const editInput = field.querySelector('.edit-input');
            // Update value and display value span
            if(editInput.value && editInput.value.trim())
                valueSpan.textContent = editInput.value;
            valueSpan.style.display = 'inline';
            editInput.style.display = 'none';

            taskObj[TaskManager.parseFieldFromTaskField(field)] = editInput.value;

            TaskManager.updateTaskElement(taskObj, (taskObj)=>{
                configureModalDefault(
                    document.querySelector(`#${TaskManager.getIdForTaskModal(taskObj.id)}`),
                    document.querySelector(`#${TaskManager.getIdForTaskElement(taskObj.id)}`)
                )
            });
        });
    });


    document.body.appendChild(taskModal);
    configureModalDefault(taskModal, taskElement);

    let btn = taskModal.querySelector(".task__remove-btn");
    btn.addEventListener('click', ()=>{
        TaskManager.removeTask(taskObj.id);
        TaskManager.renderColumnCounter(taskObj.column);
        closeModal(taskModal);
    })
}


//write method that fetches api for users and waits until it gets the data
const fetchUsers = async () => {
    let response = await fetch('https://jsonplaceholder.typicode.com/users');
    return await response.json();

}

const fetchUsersAndPopulateSelect = async (select) => {
    let users = await fetchUsers();
    users.forEach(user => {
        let option = document.createElement('option');
        option.value = user.name;
        option.textContent = user.name;
        select.appendChild(option);
    });

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
            
                <div class="field modal__title" id="${TaskManager.getIdForTaskField(taskObj.id, 'title')}">
                    <h2 class="value">${taskObj.title}</h2>
                    <input type="text" class="edit-input" style="display: none;">
                    <button class="edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                </div>
                
                <div class="field modal__expiration" id="${TaskManager.getIdForTaskField(taskObj.id, 'expiration')}">
                    <spnan style="margin-right: 5px">Expiration:</spnan>
                    <p class="value">${new Date(taskObj.expiration).toDateString()}</p>
                    <input type="date" class="edit-input" style="display: none;">
                    <button class="edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                </div>

                <div class="field modal__author" id="${TaskManager.getIdForTaskField(taskObj.id, 'author')}">              
                    <p class="value">${taskObj.author}</p>                                    
                    <select class="edit-input" style="display: none;"></select>
                    <button class="edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>  
                </div>
            
            </div>
            
            <div class="field modal__description" id="${TaskManager.getIdForTaskField(taskObj.id, 'description')}">
                <p class="value" contenteditable="true">${taskObj.description}</p>              
            </div>
            
            <p class="task__date">${new Date(taskObj.date).toDateString()}</p>
            <button class="task__remove-btn btn">Remove</button>
        </div>
    </div>
    `

    taskModal.querySelector(".modal__description .value").addEventListener("blur", (e) => {
        let description = e.target.innerText;
        console.log(description)
        TaskManager.getTaskById(taskObj.id).description = description;
        TaskManager.updateTaskElement({...taskObj, description}, (taskObj)=>{
            configureModalDefault(
                document.querySelector(`#${TaskManager.getIdForTaskModal(taskObj.id)}`),
                document.querySelector(`#${TaskManager.getIdForTaskElement(taskObj.id)}`)
            )
        });
    })

    let colorContainer = document.createElement('div');
    colorContainer.classList.add('color-container');

    Object.values(COLORS).forEach(color => {
        let colorSquare = document.createElement('div');
        colorSquare.classList.add('color-square');
        colorSquare.style.backgroundColor = color;
        colorContainer.appendChild(colorSquare);

        colorSquare.addEventListener('click', (event) => {
            const selectedColor = event.target.style.backgroundColor;
            content.style.backgroundColor = selectedColor
            taskObj.color = selectedColor;
            document.querySelector(`#${TaskManager.getIdForTaskElement(taskObj.id)}`).style.backgroundColor = selectedColor;
            document.querySelector(`#${TaskManager.getIdForTaskModal(taskObj.id)} .task`).style.backgroundColor = selectedColor;
            TaskManager.updateTaskElement(taskObj, (taskObj)=>{
                configureModalDefault(
                    document.querySelector(`#${TaskManager.getIdForTaskModal(taskObj.id)}`),
                    document.querySelector(`#${TaskManager.getIdForTaskElement(taskObj.id)}`)
                )
            });
        });
    });

    taskModal.querySelector('.task__header-wrapper').appendChild(colorContainer);

    let content = taskModal.querySelector('.modal-content');
    if(taskObj.color) {
        taskModal.querySelector(`.modal-content`).style.backgroundColor = taskObj.color;
        taskModal.querySelector(`.task`).style.backgroundColor = taskObj.color;
    }

    return taskModal;
}


