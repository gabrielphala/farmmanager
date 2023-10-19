import { Events, Next, Environment, Refresh } from "oddlyjs"

import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";
import fetch from "../helpers/fetch";

export default () => new (class Announcement {
    constructor () {
        new Events(this)
    }

    async send (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/announcement/add', {
            body: {
                subject: $('#announcement-subject').val(),
                message: $('#announcement-message').val(),
            }
        })

        if (response.successful){
            closeModal('new-announcement');
            
            return Refresh()
        }

        showError('announce', response.error)
    }

    async remove (id) {
        const response = await fetch('/announcement/remove', {
            body: {
                id
            }
        })

        if (response.successful){
            return Refresh()
        }
    }
});