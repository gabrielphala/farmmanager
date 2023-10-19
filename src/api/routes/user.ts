import { Application } from "express";

import baseController from "../controllers/base";
import userService from "../../services/User"

import { isUserOwnerOrProjectManager, isDepartmentManagerOrEmployee, isNotEmployee } from "../../middleware";

export default (app: Application) => {
    app.post('/sign-up', baseController.wrap(userService.signUpOwner));
    app.post('/sign-in', baseController.wrap(userService.signIn));
    app.post('/sign-out', baseController.signOut);

    app.get('/project-managers', isUserOwnerOrProjectManager, baseController.render('Managers'));
    app.get('/department-managers', isUserOwnerOrProjectManager, baseController.render('Departments'));
    app.get('/employees', isNotEmployee, baseController.render('Employees'));
    app.get('/task-manager', isDepartmentManagerOrEmployee, baseController.render('Task manager'));
    app.get('/announcements', baseController.render('Announcements'));
    app.get('/switch-ownership', baseController.render('Switch ownership'));

    app.post('/user/add/project-manager', baseController.wrap_with_store(userService.addProjectManager))
    app.post('/user/remove', baseController.wrap_with_store(userService.removeFarmUser))
    app.post('/user/switch-owners', baseController.wrap_with_store(userService.switchOwners))
    app.post('/user/add/department-manager', baseController.wrap_with_store(userService.addDepartmentManager))
    app.post('/user/add/department-employee', baseController.wrap_with_store(userService.addDepartmentEmployee))
    app.post('/user/get/details/by/session', baseController.wrap_with_store(userService.getCurrentUserBySession))
    app.post('/users/get/project-managers/by/farm', baseController.wrap_with_store(userService.getProjectManagers));
    app.post('/users/get/department-managers/by/farm', baseController.wrap_with_store(userService.getDepartmentManagers));
    app.post('/users/get/department-employees/by/farm', baseController.wrap_with_store(userService.getDepartmentEmployees));
}