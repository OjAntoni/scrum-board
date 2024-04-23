import dragula from "dragula";
import * as ModalUtils from "./modal";
import * as Clock from "./clock";
import TaskManager from "./TaskManager";


let drake = dragula(Array.from(document.querySelectorAll('.column__tasks-wrapper')));
drake.on('drop', (el, target, source, sibling) => {
    let foundTask = TaskManager.getTaskById(TaskManager.parseIdFromTaskElement(el));
    if(foundTask) {
        foundTask.column = target.parentNode.id;
        TaskManager.renderColumnCounter(target.parentNode.id);
        TaskManager.renderColumnCounter(source.parentNode.id);
    }
});

ModalUtils.configureAddTaskModal();
Clock.configureClock();

TaskManager.renderTasks();
TaskManager.renderColumnsCounters();

window.addEventListener('beforeunload', () => {
    TaskManager.saveTasks();
})



