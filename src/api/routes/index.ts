import { Application } from "express"

import baseRoutes from "./base"
import userRoutes from "./user"
import taskRoutes from "./task"
import announcementRoutes from "./announcement"

export default (app: Application) : void => {
    baseRoutes(app)
    userRoutes(app)
    taskRoutes(app)
    announcementRoutes(app)
}