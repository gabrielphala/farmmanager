import { Application } from "express";

import baseController from "../controllers/base";
import taskService from "../../services/Task"

export default (app: Application) => {
    app.post('/task/add', baseController.wrap_with_store(taskService.add))
    app.post('/task/start', baseController.wrap(taskService.start))
    app.post('/task/finish', baseController.wrap(taskService.finish))
    app.post('/task/remove', baseController.wrap(taskService.remove))
    app.post('/task/get/by/farm', baseController.wrap_with_store(taskService.getByFarm))
    app.post('/tasks/get/by/project', baseController.wrap_with_store(taskService.getByProject))
}