"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("../controllers/base"));
const middleware_1 = require("../../middleware");
exports.default = (app) => {
    app.get('/project-manager/managers', middleware_1.isUserOwnerOrProjectManager, base_1.default.render('Managers'));
    app.get('/project-manager/departments', middleware_1.isUserOwnerOrProjectManager, base_1.default.render('Departments'));
};
//# sourceMappingURL=projectManager.js.map