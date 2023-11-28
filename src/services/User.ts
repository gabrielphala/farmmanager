import Owner from "../models/Owner";
import DepartmentManager from "../models/DepartmentManager";
import ProjectManager from "../models/ProjectManager";
import Employee from "../models/Employee";

import Farm from "../models/Farm";
import Department from "../models/Department";
import Project from "../models/Project";

import v from "../helpers/Validation"
import hasher from "../helpers/Hasher"
import jwt from "../helpers/Jwt"

import { IAny, IResponse } from "../interfaces";

export default class UserServices {
    static async signUpOwner (wrapRes: IResponse, body: IAny) : Promise <IResponse> {
        try {
            const { fullname, farmName, email, password, passwordAgain } = body;
            
            v.validate({
                'farm name': { value: farmName, min: 5, max: 36 },
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 },
                'password': { value: password, min: 8, max: 16 },
                'password again': { value: passwordAgain, is: ['password', 'Passwords do not match'] }
            });

            if ((await Owner.exists({email})).found) throw `Email address: ${email} already exists`;
            if ((await Farm.exists({name: farmName})).found) throw `Farm name: ${farmName} already exists`;

            const ownerDetails = await Owner.insert({
                fullname,
                email,
                password: await hasher.hash(password)
            })

            const farmDetails = await Farm.insert({
                name: farmName,
                owner_id: ownerDetails.id
            })

            ownerDetails.farm_id = farmDetails.id;

            ownerDetails.save()

            delete ownerDetails.password;

            let details = { ...ownerDetails.toObject(), ...farmDetails.toObject(), role: 'Owner' }

            const tokens = jwt.get_cookie_tokens(details);
            wrapRes.set_cookie('fm_user', tokens);

            wrapRes.userDetails = details;
            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async switchOwners (wrapRes: IResponse, body: IAny, { userInfo } : IAny) : Promise <IResponse> {
        try {
            const { fullname, email } = body;
            
            v.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });

            if ((await Owner.exists({email})).found) throw `Email address: ${email} already exists`;

            const ownerDetails = await Owner.insert({
                farm_id: userInfo.farm_id,
                fullname,
                email,
                password: await hasher.hash('Password123')
            })
            
            Owner.update({ id: userInfo.id }, { isDeleted: true });

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async addProjectManager (wrapRes: IResponse, body: IAny, { userInfo }: IAny): Promise<IResponse> {
        try {
            const { fullname, email, project_id } = body;

            v.validate({
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });

            if (project_id == 'select') throw 'Please select a project'

            if (!(await Project.exists({ id: project_id })).found) throw 'Project not found'

            if ((await ProjectManager.exists({email})).found) throw 'Email already in use';

            await ProjectManager.insert({
                project_id,
                fullname,
                email,
                farm_id: userInfo.farm_id,
                password: await hasher.hash('Password123')
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async addDepartmentManager (wrapRes: IResponse, body: IAny, { userInfo }: IAny): Promise<IResponse> {
        try {
            const { department, fullname, email } = body;

            v.validate({
                'Department name': { value: department, min: 5, max: 60 },
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });

            if ((await DepartmentManager.exists({ email })).found) throw `Email address: ${email} already exists`;
            if ((await DepartmentManager.exists({ department, farm_id: userInfo.farm_id })).found) throw `Department on farm already added`;

            await DepartmentManager.insert({
                fullname,
                department,
                email,
                farm_id: userInfo.farm_id,
                password: await hasher.hash('Password123')
            })

            if (!(await Department.exists({ name: department, farm_id: userInfo.farm_id })).found) {
                Department.insert({
                    name: department,
                    farm_id: userInfo.farm_id
                })
            }

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async removeFarmUser (wrapRes: IResponse, body: IAny): Promise<IResponse> {
        try {
            const { userId, role } = body;

            const models = {
                'Employee': Employee,
                'Department manager': DepartmentManager,
                'Project manager': ProjectManager,
                'Owner': Owner
            }

            await models[role].update({ id: userId }, { isDeleted: true })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async addDepartmentEmployee (wrapRes: IResponse, body: IAny, { userInfo }: IAny): Promise<IResponse> {
        try {
            const { fullname, email } = body;

            v.validate({
                'full name': { value: fullname, min: 5, max: 60 },
                'email address': { value: email, min: 5, max: 60 }
            });

            if ((await Employee.exists({ email: email.trim().toLowerCase() })).found) throw `Email address: ${email} already exists`;
            if ((await Employee.exists({ fullname: fullname.trim().toLowerCase() })).found) throw `Full name: ${fullname} already exists`;

            await Employee.insert({
                fullname,
                department: userInfo.department,
                email,
                farm_id: userInfo.farm_id,
                password: await hasher.hash('Password123')
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async signIn (wrapRes: IResponse, body: IAny): Promise<IResponse> {
        try {
            const { email, password, role } = body;

            const models = {
                'Employee': Employee,
                'Department manager': DepartmentManager,
                'Project manager': ProjectManager,
                'Owner': Owner
            }

            v.validate({
                'email address': { value: email, min: 5, max: 60 },
                'password': { value: password, min: 8, max: 16 }
            });

            const userInfo = await models[role].findOne({
                condition: { email, isDeleted: false },
                join: {
                    ref: 'farm',
                    id: 'farm_id'
                }
            })

            if (!userInfo) throw 'User does not exist';

            if (!(await hasher.isSame(userInfo.password, password))) throw 'Password incorrect';

            delete userInfo.password;

            const tokens = jwt.get_cookie_tokens({...userInfo.toObject(), role});
            wrapRes.set_cookie('fm_user', tokens);

            wrapRes.userDetails = userInfo.toObject();
            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async getCurrentUserBySession (wrapRes: IResponse, _: IAny, store: IAny) {
        wrapRes.userDetails = store.userInfo;

        return wrapRes;
    }

    static async getProjectManagers (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        wrapRes.managers = await ProjectManager.getProjectManagers(store.userInfo.farm_id);

        return wrapRes;
    }

    static async getDepartmentManagers (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        wrapRes.managers = await DepartmentManager.getDepartmentManagers(store.userInfo.farm_id);

        return wrapRes;
    }

    static async getDepartmentEmployees (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        let employees;

        if (!store.userInfo.department) {
            employees = await Employee.getDepartmentEmployees(store.userInfo.farm_id);
        }

        else {
            employees = await Employee.getDepartmentEmployeesByDepartment(store.userInfo.farm_id, store.userInfo.department);
        }
        
        wrapRes.employees = employees;

        return wrapRes;
    }
};