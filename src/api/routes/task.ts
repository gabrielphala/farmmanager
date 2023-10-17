import { Application } from "express";

import baseController from "../controllers/base";
import taskService from "../../services/Task"

export default (app: Application) => {
    app.post('/task/add', baseController.wrap_with_store(taskService.add))
    app.post('/task/get/by/farm', baseController.wrap_with_store(taskService.getByFarm))
}