"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Owner_1 = __importDefault(require("../models/Owner"));
const DepartmentManager_1 = __importDefault(require("../models/DepartmentManager"));
const ProjectManager_1 = __importDefault(require("../models/ProjectManager"));
const Employee_1 = __importDefault(require("../models/Employee"));
const Farm_1 = __importDefault(require("../models/Farm"));
const Department_1 = __importDefault(require("../models/Department"));
const Validation_1 = __importDefault(require("../helpers/Validation"));
const Hasher_1 = __importDefault(require("../helpers/Hasher"));
const Jwt_1 = __importDefault(require("../helpers/Jwt"));
class UserServices {
    static async signUpOwner(wrapRes, body) {
        try {
            const { fullname, farmName, email, password, passwordAgain } = body;
            Validation_1.default.validate({
                'farm name': { value: farmName, min: 5, max: 36 },
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 },
                'password': { value: password, min: 8, max: 16 },
                'password again': { value: passwordAgain, is: ['password', 'Passwords do not match'] }
            });
            if ((await Owner_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            if ((await Farm_1.default.exists({ name: farmName })).found)
                throw `Farm name: ${farmName} already exists`;
            const ownerDetails = await Owner_1.default.insert({
                fullname,
                email,
                password: await Hasher_1.default.hash(password)
            });
            const farmDetails = await Farm_1.default.insert({
                name: farmName,
                owner_id: ownerDetails.id
            });
            ownerDetails.farm_id = farmDetails.id;
            ownerDetails.save();
            delete ownerDetails.password;
            let details = { ...ownerDetails.toObject(), ...farmDetails.toObject(), role: 'Owner' };
            const tokens = Jwt_1.default.get_cookie_tokens(details);
            wrapRes.set_cookie('fm_user', tokens);
            wrapRes.userDetails = details;
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async switchOwners(wrapRes, body, { userInfo }) {
        try {
            const { fullname, email } = body;
            Validation_1.default.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });
            if ((await Owner_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            const ownerDetails = await Owner_1.default.insert({
                farm_id: userInfo.farm_id,
                fullname,
                email,
                password: await Hasher_1.default.hash('Password123')
            });
            Owner_1.default.update({ id: userInfo.id }, { isDeleted: true });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addProjectManager(wrapRes, body, { userInfo }) {
        try {
            const { fullname, email } = body;
            Validation_1.default.validate({
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });
            await ProjectManager_1.default.insert({
                fullname,
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addDepartmentManager(wrapRes, body, { userInfo }) {
        try {
            const { department, fullname, email } = body;
            Validation_1.default.validate({
                'Department name': { value: department, min: 5, max: 60 },
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });
            if ((await DepartmentManager_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            if ((await DepartmentManager_1.default.exists({ department, farm_id: userInfo.farm_id })).found)
                throw `Department on farm already added`;
            await DepartmentManager_1.default.insert({
                fullname,
                department,
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            if (!(await Department_1.default.exists({ name: department, farm_id: userInfo.farm_id })).found) {
                Department_1.default.insert({
                    name: department,
                    farm_id: userInfo.farm_id
                });
            }
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async removeFarmUser(wrapRes, body) {
        try {
            const { userId, role } = body;
            const models = {
                'Employee': Employee_1.default,
                'Department manager': DepartmentManager_1.default,
                'Project manager': ProjectManager_1.default,
                'Owner': Owner_1.default
            };
            await models[role].update({ id: userId }, { isDeleted: true });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async addDepartmentEmployee(wrapRes, body, { userInfo }) {
        try {
            const { fullname, email } = body;
            Validation_1.default.validate({
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });
            if ((await Employee_1.default.exists({ email })).found)
                throw `Email address: ${email} already exists`;
            await Employee_1.default.insert({
                fullname,
                department: userInfo.department,
                email,
                farm_id: userInfo.farm_id,
                password: await Hasher_1.default.hash('Password123')
            });
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async signIn(wrapRes, body) {
        try {
            const { email, password, role } = body;
            const models = {
                'Employee': Employee_1.default,
                'Department manager': DepartmentManager_1.default,
                'Project manager': ProjectManager_1.default,
                'Owner': Owner_1.default
            };
            Validation_1.default.validate({
                'email address': { value: email, min: 5, max: 60 },
                'password': { value: password, min: 8, max: 16 }
            });
            const userInfo = await models[role].findOne({
                condition: { email, isDeleted: false },
                join: {
                    ref: 'farm',
                    id: 'farm_id'
                }
            });
            if (!userInfo)
                throw 'User does not exist';
            if (!(await Hasher_1.default.isSame(userInfo.password, password)))
                throw 'Password incorrect';
            delete userInfo.password;
            const tokens = Jwt_1.default.get_cookie_tokens({ ...userInfo.toObject(), role });
            wrapRes.set_cookie('fm_user', tokens);
            wrapRes.userDetails = userInfo.toObject();
            wrapRes.successful = true;
        }
        catch (e) {
            throw e;
        }
        return wrapRes;
    }
    static async getCurrentUserBySession(wrapRes, _, store) {
        wrapRes.userDetails = store.userInfo;
        return wrapRes;
    }
    static async getProjectManagers(wrapRes, body, store) {
        wrapRes.managers = await ProjectManager_1.default.getProjectManagers(store.userInfo.farm_id);
        return wrapRes;
    }
    static async getDepartmentManagers(wrapRes, body, store) {
        wrapRes.managers = await DepartmentManager_1.default.getDepartmentManagers(store.userInfo.farm_id);
        return wrapRes;
    }
    static async getDepartmentEmployees(wrapRes, body, store) {
        let employees;
        if (!store.userInfo.department) {
            employees = await Employee_1.default.getDepartmentEmployees(store.userInfo.farm_id);
        }
        else {
            employees = await Employee_1.default.getDepartmentEmployeesByDepartment(store.userInfo.farm_id, store.userInfo.department);
        }
        wrapRes.employees = employees;
        return wrapRes;
    }
}
exports.default = UserServices;
;
//# sourceMappingURL=User.js.map