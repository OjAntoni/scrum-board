
class TaskManager{
    #tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    getTaskById(id){
        let find = this.#tasks.find(task => task.id === Number.parseInt(id));
        return find ? find : null;
    }

    getIdForTaskElement(id){return `task_${id}`}
    getIdForTaskModal(id){return `taskModal_${id}`}
    parseIdFromTaskElement(taskElement){ return taskElement.id.split('_')[1]}

    getIdForTaskField(id, field){return `task_${id}_${field}`}
    parseFieldFromTaskField(taskFieldElement){ return taskFieldElement.id.split('_')[2]}

    createTaskElement(title, author, description, date){
        let newTask = {
            id: Math.trunc(Math.random()*10000),
            title: title,
            author: author,
            description: description,
            date: Date.now(),
            column: 'todo',
            expiration: date,
        }

        this.#tasks.push(newTask)

        const taskElement = this.#getHtmlForTask(newTask);
        document.querySelector('.column__tasks-wrapper').appendChild(taskElement);

        return taskElement;
    }

    updateTaskElement(taskObj, callbackForTaskElement){
        let taskElement = this.#getHtmlForTask(taskObj);
        document.querySelector(`#${this.getIdForTaskElement(taskObj.id)}.task`).replaceWith(taskElement);
        callbackForTaskElement(taskObj);
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

    renderTasks(callableForTaskElement){
        this.#tasks.forEach(task => {
            const taskElement = this.#getHtmlForTask(task);
            document.querySelector(`#${task.column} .column__tasks-wrapper`)?.appendChild(taskElement);
            if(callableForTaskElement) callableForTaskElement(taskElement);
        })
    };

    saveTasks(){
        localStorage.setItem('tasks', JSON.stringify(this.#tasks));
    }

    #limitChars = (text, limit) => {
        if (text.length > limit) {
            text = text.substring(0, limit).trim();
            text += '...';
        }
        return text;
    }

    #getHtmlForTask(task){
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.id = this.getIdForTaskElement(task.id);
        if(task.color) taskElement.style.backgroundColor = task.color;
        taskElement.innerHTML = `
                <div class="task__header-wrapper">
                    <h3 class="task__title">
                        ${this.#limitChars(task.title, 60)}
                    </h3>
                    <p class="task__author">
                        ${task.author}
                    </p>
                </div>
                <p class="task__description">
                    ${this.#limitChars(task.description, 190)}
                </p>
                <p class="task__date ">
                    ${new Date(task.date).toDateString()}
                </p>`
        return taskElement;
    }

    countByColumn(name){
        return this.#tasks.filter(task => task.column === name).length;
    }

    renderColumnsCounters(){
        document.querySelectorAll('.column').forEach(column => {
            let columnName = column.id;
            let count = this.countByColumn(columnName);
            column.querySelector('.column__count').textContent = `(${count})`;
        })
    }

    renderColumnCounter(name){
        let column = document.querySelector(`#${name} .column__count`);
        column.textContent = `(${this.#tasks.filter(task => task.column === name).length})`
    }
}

export default new TaskManager();