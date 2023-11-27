import { Events, Next, Environment, Refresh } from "oddlyjs"

import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";
import fetch from "../helpers/fetch";

let tableHeader = [
    '#', 'Project', 'Objective', 'Lead (Reporting) Employee', 'Progress'
]

let allowedColumns = [
    'name', 'objective', 'fullname', 'progress'
]

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

    async downloadCSV (e: PointerEvent) {
        const tasks = (e.currentTarget as HTMLElement).dataset.tasks as string;

        const response = await fetch('/download/csv', {
            body: {
                data: JSON.parse(tasks),
                tableHeader,
                allowedColumns,
				reportName: 'Tasks'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }
});