import { Route } from "oddlyjs"

export default (): void => {
    Route({
        name: 'sign.up',
        url: '/sign-up',
        layoutpath: 'auth'
    })

    Route({
        name: 'sign.in',
        url: '/sign-in',
        layoutpath: 'auth'
    })
}