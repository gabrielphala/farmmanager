import User from "../models/User"
import Farm from "../models/Farm";

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

            if ((await User.exists({email})).found) throw `Email address: ${email} already exists`;
            if ((await Farm.exists({name: farmName})).found) throw `Farm name: ${farmName} already exists`;

            const ownerDetails = await User.insert({
                fullname,
                role: 'Owner',
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

            let details = { ...ownerDetails.toObject(), ...farmDetails.toObject() }

            const tokens = jwt.get_cookie_tokens(details);
            wrapRes.set_cookie('fm_user', tokens);

            wrapRes.userDetails = details;
            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async addProjectManager (wrapRes: IResponse, body: IAny, { userInfo }: IAny): Promise<IResponse> {
        try {
            const { fullname, email } = body;

            v.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });

            await User.insert({
                fullname,
                role: 'Project manager',
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
                'Department name': { value: department, min: 5, max: 55 },
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });

            if ((await User.exists({ email })).found) throw `Email address: ${email} already exists`;
            if ((await User.exists({ department, role: 'Department manager'})).found) throw `Department on farm already added`;

            await User.insert({
                fullname,
                role: 'Department manager',
                department,
                email,
                farm_id: userInfo.farm_id,
                password: await hasher.hash('Password123')
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async removeFarmUser (wrapRes: IResponse, body: IAny): Promise<IResponse> {
        try {
            const { userId } = body;

            await User.update({ id: userId }, { isDeleted: true })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async addDepartmentEmployee (wrapRes: IResponse, body: IAny, { userInfo }: IAny): Promise<IResponse> {
        try {
            const { fullname, email } = body;

            v.validate({
                'full name': { value: fullname, min: 5, max: 36 },
                'email address': { value: email, min: 5, max: 46 }
            });

            if ((await User.exists({ email })).found) throw `Email address: ${email} already exists`;

            await User.insert({
                fullname,
                role: 'Employee',
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

            v.validate({
                'email address': { value: email, min: 5, max: 46 },
                'password': { value: password, min: 8, max: 16 }
            });

            const userInfo = await User.findOne({
                condition: { email, role, isDeleted: false },
                join: {
                    ref: 'farm',
                    id: 'farm_id'
                }
            })

            if (!userInfo) throw 'User does not exist';

            if (!(await hasher.isSame(userInfo.password, password))) throw 'Password incorrect';

            const farmDetails = await Farm.findOne({
                condition: { id: userInfo.farm_id }
            });

            delete userInfo.password;


            const tokens = jwt.get_cookie_tokens(userInfo.toObject());
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
        wrapRes.managers = await User.getProjectManagers(store.userInfo.farm_id);

        return wrapRes;
    }

    static async getDepartmentManagers (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        wrapRes.managers = await User.getDepartmentManagers(store.userInfo.farm_id);

        return wrapRes;
    }

    static async getDepartmentEmployees (wrapRes: IResponse, body: IAny, store: IAny) : Promise <IResponse> {
        wrapRes.employees = await User.getDepartmentEmployees(store.userInfo.farm_id);

        return wrapRes;
    }
};