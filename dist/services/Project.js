"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("../models/Project"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
class ProjectServices {
    static async add(wrapRes, body, { userInfo }) {
        try {
            const { name, objective, department } = body;
            Validation_1.default.validate({
                'objective': { value: objective, min: 5, max: 136 }
            });
            if (department == 'select')
                throw 'Please select department';
            await Project_1.default.insert({
                farm_id: userInfo.farm_id,
                name,
                department,
                objective
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getAllByFarm(wrapRes, body, { userInfo }) {
        wrapRes.projects = await Project_1.default.find({
            condition: {
                farm_id: userInfo.farm_id
            }
        });
        return wrapRes;
    }
}
exports.default = ProjectServices;
;
//# sourceMappingURL=Project.js.map