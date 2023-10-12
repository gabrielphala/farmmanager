import { Application } from "express"

import baseRoutes from "./base"
import userRoutes from "./user"

export default (app: Application) : void => {
    baseRoutes(app)
    userRoutes(app)
}