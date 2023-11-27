import { Events, Next, Environment, Refresh } from "oddlyjs"

import { showError } from "../helpers/error-container";
import { closeModal, openModal } from "../helpers/modal";
import fetch from "../helpers/fetch";

declare var Gantt;

let tableHeader = [
    '#', 'Project name', 'Project objective', 'Department', 'Progress (status)'
]

let allowedColumns = [
    'name', 'objective', 'department', 'status'
]

export default () => new (class Project {
    constructor () {
        new Events(this)
    }

    async add (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/project/add', {
            body: {
                name: $('#project-name').val(),
                objective: $('#project-objective').val(),
                department: $('#project-department').val()
            }
        })

        if (response.successful){
            closeModal('new-project');
            
            return Refresh()
        }

		showError('project', response.error);
    }

    async viewGantt (project_id) {
        const response = await fetch('/tasks/get/by/project', {
            body: {
                project_id
            }
        })

        var tasks: any = [ ];

        response.tasks.forEach(task => {
            if (task.startedOn && task.finishedOn)
                tasks.push({
                    id: task.id,
                    name: task.objective,
                    start: task.startedOn,
                    end: task.finishedOn,
                    progress: 20,
                    dependencies: '',
                    custom_class: 'bar-milestone' // optional
                })
        });

        var gantt = new Gantt("#gantt", tasks);

        openModal('gantt')
    }

    async downloadCSV (e: PointerEvent) {
        const projects = (e.currentTarget as HTMLElement).dataset.projects as string;

        const response = await fetch('/download/csv', {
            body: {
                data: JSON.parse(projects),
                tableHeader,
                allowedColumns,
				reportName: 'Projects'
            }
        });

        if (response.successful) {
            const anchor = $('#download-anchor')

            anchor.attr('href', `/assets/downloads/tmp/${response.filename}`)

            anchor[0].click();
        }
    }
});