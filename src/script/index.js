import dragula from "dragula";
import * as ModalUtils from "./modal";
import TaskManager from "./TaskManager";


let drake = dragula(Array.from(document.querySelectorAll('.column__tasks-wrapper')));
drake.on('drop', (el, target, source, sibling) => {
    let foundTask = TaskManager.getTaskById(TaskManager.parseIdFromTaskElement(el));
    if(foundTask) foundTask.column = target.parentNode.id;
});

ModalUtils.configureAddTaskModal();

TaskManager.renderTasks();

window.addEventListener('beforeunload', () => {
    TaskManager.saveTasks();
})


