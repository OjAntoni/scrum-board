import dragula from "dragula";
import * as ModalUtils from "./modal";

let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

export const getTaskById = (id) => {
    let find = tasks.find(task => task.id === Number.parseInt(id));
    return find ? find : null;
}

let drake = dragula(Array.from(document.querySelectorAll('.column__tasks-wrapper')));
drake.on('drop', (el, target, source, sibling) => {
    let foundTask = getTaskById(parseIdFromTaskElement(el));
    if(foundTask) foundTask.column = target.parentNode.id;
});

export const getIdForTaskElement = id => `task_${id}`;
export const getIdForTaskModal = id => `taskModal_${id}`;
export const parseIdFromTaskElement = taskElement => taskElement.id.split('_')[1];

export const createTaskElement = (title, author, description) => {
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





ModalUtils.configureAddTaskModal();





export const removeTask = (id) => {
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
        ModalUtils.createModalForTask(taskElement);
})};
renderTasks();

window.addEventListener('beforeunload', () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
})


