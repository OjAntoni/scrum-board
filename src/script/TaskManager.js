import * as ModalUtils from "./modal";

class TaskManager{
    #tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    getTaskById(id){
        let find = this.#tasks.find(task => task.id === Number.parseInt(id));
        return find ? find : null;
    }

    getIdForTaskElement(id){return `task_${id}`}
    getIdForTaskModal(id){return `taskModal_${id}`}
    parseIdFromTaskElement(taskElement){ return taskElement.id.split('_')[1]}

    createTaskElement(title, author, description){
        let newTask = {
            id: Math.trunc(Math.random()*10000),
            title: title,
            author: author,
            description: description,
            date: Date.now(),
            column: 'todo'
        }

        this.#tasks.push(newTask)

        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.id = this.getIdForTaskElement(newTask.id);
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

    removeTask(id){
        let taskId = Number.parseInt(id);
        let taskModal = document.querySelector(`#${this.getIdForTaskModal(taskId)}.modal`);
        let taskElement = document.querySelector(`#${this.getIdForTaskElement(taskId)}.task`);

        if(taskModal) taskModal.remove();
        if(taskElement) taskElement.remove();

        let index = this.#tasks.findIndex(task => task.id === taskId);
        if (index > -1) {
            this.#tasks.splice(index, 1);
        }
    }

    renderTasks(){
        this.#tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.id = this.getIdForTaskElement(task.id);
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

    saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(this.#tasks));
    }
}

export default new TaskManager();