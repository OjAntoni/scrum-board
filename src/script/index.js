import dragula from "dragula";

let drake = dragula(Array.from(document.querySelectorAll('.column__tasks-wrapper')));
drake.on('drop', (el, target, source, sibling) => {
    let foundTask = tasks.find(task => task.id === Number.parseInt(el.id));
    if(foundTask) foundTask.column = target.parentNode.id;
});

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
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
    taskElement.id = newTask.id+"";
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

    return newTask;
}

const configureAddTaskModal = () => {
    let modal = document.getElementById('newTaskModal');
    let btn = document.getElementById('addTaskBtn');
    let span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
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
                let modal = document.getElementById('newTaskModal');
                closeModal(modal);
                clearNewTaskForm();
            }
    })

    // Select the form
    let form = document.querySelector('.task-form');

    // Add event listener
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Collect form data
        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let description = document.getElementById('description').value;
        let date = document.getElementById('date').value;

        createTaskElement(title, author, description)
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

const renderTasks = () => {
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.id = task.id;
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
})};

renderTasks();

window.addEventListener('beforeunload', () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
})


