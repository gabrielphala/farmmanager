import Task from "../models/Task"

import v from "../helpers/Validation"
import hasher from "../helpers/Hasher"

import { IAny, IResponse } from "../interfaces";

export default class TaskServices {
    static async add (wrapRes: IResponse, body: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            const { objective, leadEmployeeId } = body;
            
            v.validate({
                'Objective': { value: objective, min: 5, max: 136 }
            });

            if (leadEmployeeId == 'select') throw 'Please select employee';

            await Task.insert({
                objective,
                lead_employee_id: leadEmployeeId,
                farm_id: userInfo.farm_id
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async getByFarm (wrapRes: IResponse, body: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            wrapRes.tasks = await Task.find({
                condition: {
                    farm_id: userInfo.farm_id,
                    isDeleted: false
                },
                join: {
                    ref: 'user',
                    id: 'lead_employee_id'
                }
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }
};