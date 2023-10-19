import { Application } from "express";

import baseController from "../controllers/base";
import announcementService from "../../services/Announcement"

export default (app: Application) => {
    app.post('/announcement/add', baseController.wrap_with_store(announcementService.send))
    app.post('/announcement/remove', baseController.wrap(announcementService.remove))
    app.post('/announcements/get/by/farm', baseController.wrap_with_store(announcementService.getByFarm))
}