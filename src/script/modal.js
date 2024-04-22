import TaskManager from "./TaskManager";

export const configureModalDefault = (modal, elementToOpen) => {
    let span = modal.getElementsByClassName("close")[0];

    elementToOpen.onclick = function() {
        if(modal.querySelector('select'))
            fetchUsersAndPopulateSelect(modal.querySelector('select')).then(r => {} )
        openModal(modal);
    }

    span.onclick = function() {
        closeModal(modal);
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal(modal);
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === "Escape") { // Check if the pressed key is "Escape"
            closeModal(modal);
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
            valueSpan.textContent = editInput.value;
            valueSpan.style.display = 'inline';
            editInput.style.display = 'none';

            taskObj[TaskManager.parseFieldFromTaskField(field)] = editInput.value;
            TaskManager.updateTaskElement(taskObj);
        });
    });


    document.body.appendChild(taskModal);
    configureModalDefault(taskModal, taskElement);

    let btn = taskModal.querySelector(".task__remove-btn");
    btn.addEventListener('click', ()=>{
        TaskManager.removeTask(taskObj.id);
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
    console.log(users);
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
            
                <div class="field" id="${TaskManager.getIdForTaskField(taskObj.id, 'title')}">
                    <h2 class="value">${taskObj.title}</h2>
                    <button class="edit-btn">Edit</button>
                    <input type="text" class="edit-input" style="display: none;">
                </div>
                <div class="field" id="${TaskManager.getIdForTaskField(taskObj.id, 'author')}">
                    <p class="value">${taskObj.author}</p>
                    <button class="edit-btn">Edit</button>
                    <select class="edit-input"></select>
                </div>
            
            </div>
            
            <div class="field" id="${TaskManager.getIdForTaskField(taskObj.id, 'description')}">
                <p class="value">${taskObj.description}</p>
                <button class="edit-btn">Edit</button>
                <input type="text" class="edit-input" style="display: none;">
            </div>
            
            <p class="task__date">${new Date(taskObj.date).toDateString()}</p>
            <button class="task__remove-btn btn">Remove</button>
        </div>
    </div>
    `
    return taskModal;
}


