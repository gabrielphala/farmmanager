import Project from "../models/Project"

import v from "../helpers/Validation"

import { IAny, IResponse } from "../interfaces";

export default class ProjectServices {
    static async add (wrapRes: IResponse, body: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            const { name, objective, department } = body;
            
            v.validate({
                'objective': { value: objective, min: 5, max: 136 }
            });

			if (department == 'select') throw 'Please select department';

            await Project.insert({
                farm_id: userInfo.farm_id,
				name,
				department,
				objective
            })

            wrapRes.successful = true;

        } catch (e) { throw e; }

        return wrapRes;
    }

    static async getAllByFarm (wrapRes: IResponse, body: IAny, { userInfo }: IAny) {
        wrapRes.projects = await Project.find({
            condition: {
                farm_id: userInfo.farm_id
            }
        })

        return wrapRes;
    }
};