import { Events, Next, Environment, Refresh } from "oddlyjs"

import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";
import fetch from "../helpers/fetch";

export default () => new (class Task {
    constructor () {
        new Events(this)
    }

    async add (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/task/add', {
            body: {
                objective: $('#task-objective').val(),
                leadEmployeeId: $('#task-employee-id').val(),
                projectId: $('#task-project-id').val(),
            }
        })

        if (response.successful){
            closeModal('new-task');
            
            return Refresh()
        }

        showError('task', response.error);
    }

    async start (task_id) {
        const response = await fetch('/task/start', {
            body: {
                task_id
            }
        })

        if (response.successful){
            return Refresh()
        }
    }

    async finish (task_id) {
        const response = await fetch('/task/finish', {
            body: {
                task_id
            }
        })

        if (response.successful){
            return Refresh()
        }
    }

    async remove (task_id) {
        const response = await fetch('/task/remove', {
            body: {
                task_id
            }
        })

        if (response.successful){
            return Refresh()
        }
    }
});