"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = __importDefault(require("../models/Project"));
const Task_1 = __importDefault(require("../models/Task"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
const sqlifier_1 = require("sqlifier");
class TaskServices {
    static async add(wrapRes, body, { userInfo }) {
        try {
            const { objective, leadEmployeeId, projectId } = body;
            Validation_1.default.validate({
                'Objective': { value: objective, min: 5, max: 136 }
            });
            if (leadEmployeeId == 'select')
                throw 'Please select employee';
            if (projectId == 'select')
                throw 'Please select project';
            await Task_1.default.insert({
                objective,
                lead_employee_id: leadEmployeeId,
                farm_id: userInfo.farm_id,
                project_id: projectId
            });
            const project = await Project_1.default.findOne({ condition: { id: projectId } });
            project.tasks_no++;
            project.status = 'ongoing';
            project.save();
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async start(wrapRes, body) {
        try {
            const { task_id } = body;
            Task_1.default.update({ id: task_id }, { progress: 'ongoing', startedOn: sqlifier_1.SQLDate.toSQLDatetime(new Date()) });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async finish(wrapRes, body) {
        try {
            const { task_id } = body;
            const task = await Task_1.default.findOne({ condition: { id: task_id } });
            task.progress = 'done';
            task.finishedOn = sqlifier_1.SQLDate.toSQLDatetime(new Date());
            task.save();
            const project = await Project_1.default.findOne({ condition: { id: task.project_id } });
            if (project.tasks_no == project.tasks_completed_no + 1) {
                project.tasks_completed_no++;
                project.status = 'done';
                project.save();
            }
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async remove(wrapRes, body) {
        try {
            const { task_id } = body;
            Task_1.default.update({ id: task_id }, { isDeleted: true });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getByFarm(wrapRes, body, { userInfo }) {
        try {
            if (!userInfo.department)
                wrapRes.tasks = await Task_1.default.find({
                    condition: {
                        farm_id: userInfo.farm_id,
                        isDeleted: false
                    },
                    join: [
                        {
                            ref: 'employee',
                            id: 'lead_employee_id'
                        },
                        {
                            ref: 'project',
                            id: 'project_id'
                        },
                    ]
                });
            else {
                wrapRes.tasks = await Task_1.default.find({
                    condition: {
                        farm_id: userInfo.farm_id,
                        isDeleted: false
                    },
                    join: [
                        {
                            ref: 'employee',
                            kind: 'right',
                            condition: {
                                'id': { $r: 'task.lead_employee_id' },
                                'department': userInfo.department
                            }
                        },
                        {
                            ref: 'project',
                            id: 'project_id'
                        },
                    ]
                });
            }
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getByProject(wrapRes, body) {
        try {
            wrapRes.tasks = await Task_1.default.find({
                condition: {
                    project_id: body.project_id,
                    isDeleted: false
                },
                join: [
                    {
                        ref: 'employee',
                        id: 'lead_employee_id'
                    },
                    {
                        ref: 'project',
                        id: 'project_id'
                    },
                ]
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