import { Events, Next, Environment, Refresh } from "oddlyjs"

import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";
import fetch from "../helpers/fetch";

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
});