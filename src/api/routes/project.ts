import { Application } from "express";

import baseController from "../controllers/base";
import projectService from "../../services/Project"

export default (app: Application) => {
    app.post('/project/add', baseController.wrap_with_store(projectService.add))
    app.post('/projects/get/by/farm', baseController.wrap_with_store(projectService.getAllByFarm))
}