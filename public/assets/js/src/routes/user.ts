import { Route } from "oddlyjs"

export default (): void => {
    Route({
        name: 'project.managers',
        url: '/project-managers',
        layoutpath: 'info'
    })

    Route({
        name: 'department.managers',
        url: '/department-managers',
        layoutpath: 'info'
    })

    Route({
        name: 'employees',
        url: '/employees',
        layoutpath: 'info'
    })

    Route({
        name: 'task.manager',
        url: '/task-manager',
        layoutpath: 'info'
    })
}