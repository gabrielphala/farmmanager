import { Application } from "express";

import baseController from "../controllers/base";
import DownloadService from "../../services/Download";

export default (app: Application) => {
    app.get('/sign-up', baseController.render('Sign up'))
    app.get('/sign-in', baseController.render('Sign in'))

    app.post('/download/csv', baseController.wrap(DownloadService.download))
}