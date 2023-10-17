import { Events, Next, Environment, Refresh } from "oddlyjs"
import { loadSignal } from "oddlyjs/src/Signal";

import { showError } from "../helpers/error-container";
import { closeModal } from "../helpers/modal";
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

        // showError('auth', response.error)
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

        // showError('auth', response.error)
    }

    async removeDepartmentManager (id, departmentName) {

        const response = await fetch('/user/remove/department-manager', {
            body: {
                userId: id,
                departmentName
            }
        })

        if (response.successful) {
            Refresh()

            closeModal('new-department-manager')
        }

        // showError('auth', response.error)
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

        // showError('auth', response.error)
    }

    async removeDepartmentEmployee (id) {

        const response = await fetch('/user/remove/department-employee', {
            body: {
                userId: id
            }
        })

        if (response.successful) {
            Refresh();
        }

        // showError('auth', response.error)
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