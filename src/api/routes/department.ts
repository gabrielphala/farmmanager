import { Application } from "express";

import baseController from "../controllers/base";
import departmentService from "../../services/Department"

export default (app: Application) => {
    app.post('/departments/get/by/farm', baseController.wrap_with_store(departmentService.getAllByFarm))
}