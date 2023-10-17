"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Task_1 = __importDefault(require("../models/Task"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
class TaskServices {
    static async add(wrapRes, body, { userInfo }) {
        try {
            const { objective, leadEmployeeId } = body;
            Validation_1.default.validate({
                'Objective': { value: objective, min: 5, max: 136 }
            });
            if (leadEmployeeId == 'select')
                throw 'Please select employee';
            await Task_1.default.insert({
                objective,
                lead_employee_id: leadEmployeeId,
                farm_id: userInfo.farm_id
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getByFarm(wrapRes, body, { userInfo }) {
        try {
            wrapRes.tasks = await Task_1.default.find({
                condition: {
                    farm_id: userInfo.farm_id,
                    isDeleted: false
                },
                join: {
                    ref: 'user',
                    id: 'lead_employee_id'
                }
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
}
exports.default = TaskServices;
;
//# sourceMappingURL=Task.js.map