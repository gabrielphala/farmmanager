import { Application } from "express";

import baseController from "../controllers/base";

export default (app: Application) => {
    app.get('/sign-up', baseController.render('Sign up'))
    app.get('/sign-in', baseController.render('Sign in'))
}