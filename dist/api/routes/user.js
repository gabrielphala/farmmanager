"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const User_1 = __importDefault(require("../../services/User"));
const middleware_1 = require("../../middleware");
exports.default = (app) => {
    app.post('/sign-up', base_1.default.wrap(User_1.default.signUpOwner));
    app.post('/sign-in', base_1.default.wrap(User_1.default.signIn));
    app.post('/sign-out', base_1.default.signOut);
    app.get('/project-managers', middleware_1.isUserOwnerOrProjectManager, base_1.default.render('Managers'));
    app.get('/department-managers', middleware_1.isUserOwnerOrProjectManager, base_1.default.render('Departments'));
    app.get('/employees', middleware_1.isNotEmployee, base_1.default.render('Employees'));
    app.get('/task-manager', middleware_1.isDepartmentManagerOrEmployee, base_1.default.render('Task manager'));
    app.get('/projects', middleware_1.isDepartmentManagerOrEmployee, base_1.default.render('Projects'));
    app.get('/announcements', base_1.default.render('Announcements'));
    app.get('/switch-ownership', base_1.default.render('Switch ownership'));
    app.post('/user/add/project-manager', base_1.default.wrap_with_store(User_1.default.addProjectManager));
    app.post('/user/remove', base_1.default.wrap_with_store(User_1.default.removeFarmUser));
    app.post('/user/switch-owners', base_1.default.wrap_with_store(User_1.default.switchOwners));
    app.post('/user/add/department-manager', base_1.default.wrap_with_store(User_1.default.addDepartmentManager));
    app.post('/user/add/department-employee', base_1.default.wrap_with_store(User_1.default.addDepartmentEmployee));
    app.post('/user/get/details/by/session', base_1.default.wrap_with_store(User_1.default.getCurrentUserBySession));
    app.post('/users/get/project-managers/by/farm', base_1.default.wrap_with_store(User_1.default.getProjectManagers));
    app.post('/users/get/department-managers/by/farm', base_1.default.wrap_with_store(User_1.default.getDepartmentManagers));
    app.post('/users/get/department-employees/by/farm', base_1.default.wrap_with_store(User_1.default.getDepartmentEmployees));
};
//# sourceMappingURL=user.js.map