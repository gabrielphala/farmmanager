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
            }
        })

        if (response.successful){
            closeModal('new-task');
            
            return Refresh()
        }
    }
});