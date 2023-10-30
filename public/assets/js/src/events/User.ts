import { Events, Next, Environment, Refresh } from "oddlyjs"


import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";

import Util from "./Util";

import fetch from "../helpers/fetch";

export default () => new (class User {
    constructor () {
        new Events(this)
    }

    async signUpOwner (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/sign-up', {
            body: {
                farmName: $('#user-farm-name').val(),
                fullname: $('#user-full-name').val(),
                email: $('#user-email').val(),
                password: $('#user-password').val(),
                passwordAgain: $('#user-password-again').val()
            }
        })

        if (response.successful) {
            Environment.put('userDetails', response.userDetails);

            return Next('/project-managers')
        }

        showError('auth', response.error)
    }
    
    async switchOwners (e: PointerEvent) {
        e.preventDefault();

        $('#switch-btn').text('Switching owners...')
        $('#switch-btn').prop('disabled', true)

        const response = await fetch('/user/switch-owners', {
            body: {
                fullname: $('#fullname').val(),
                email: $('#email-address').val()
            }
        })

        if (response.successful) {
            $('#switch-btn').text('Switch')
            $('#switch-btn').prop('disabled', false)

            return Util().signOut()
        }

        showError('switch-owners', response.error)
    }

    async addProjectManager (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/user/add/project-manager', {
            body: {
                fullname: $('#user-full-name').val(),
                email: $('#user-email').val()
            }
        })

        if (response.successful) {
            Refresh()

            closeModal('new-project-manager')
        }

        showError('project-manager', response.error)
    }

    async addDepartmentManager (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/user/add/department-manager', {
            body: {
                department: $('#department-name').val(),
                fullname: $('#user-full-name').val(),
                email: $('#user-email').val()
            }
        })

        if (response.successful) {
            Refresh()

            closeModal('new-department-manager')
        }

        showError('department-manager', response.error)
    }

    async addDepartmentEmployee (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/user/add/department-employee', {
            body: {
                fullname: $('#user-full-name').val(),
                email: $('#user-email').val()
            }
        })

        if (response.successful) {
            Refresh();

            closeModal('new-department-employee')
        }

        showError('department-employee', response.error)
    }

    async removeUser (id) {
        const response = await fetch('/user/remove', {
            body: {
                userId: id
            }
        })

        if (response.successful) {
            Refresh();
        }
    }

    async signIn (e: PointerEvent) {
        e.preventDefault();

        const response = await fetch('/sign-in', {
            body: {
                email: $('#user-email').val(),
                role: $('input[name="account-type"]:checked').val(),
                password: $('#user-password').val()
            }
        })

        if (response.successful) {
            Environment.put('userDetails', response.userDetails);

            const roles = {
                'Owner': '/project-managers',
                'Project manager': '/project-managers',
                'Department manager': '/task-manager',
                'Employee': '/task-manager',
            }

            return Next(roles[$('input[name="account-type"]:checked').val() as string])
        }

        showError('auth', response.error)
    }

    selectAccountType (e: PointerEvent) {
        $('.auth__main__form__account-selection__active').removeClass('auth__main__form__account-selection__active')

        $(e.currentTarget as HTMLElement).addClass('auth__main__form__account-selection__active')
    }
});