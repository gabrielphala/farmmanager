import Project from "../models/Project"

import v from "../helpers/Validation"

import { IAny, IResponse } from "../interfaces";

export default class ProjectServices {
    static async add (wrapRes: IResponse, body: IAny, { userInfo }: IAny) : Promise <IResponse> {
        try {
            const { name, objective } = body;
            
            v.validate({
                'objective': { value: objective, min: 5, max: 136 }
            });

            await Project.insert({
                farm_id: userInfo.farm_id,
				name,
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

    static async getAllByDepartment (wrapRes: IResponse, body: IAny, { userInfo }: IAny) {
        wrapRes.projects = await Project.find({
            condition: {
                farm_id: userInfo.farm_id,
            }
        })

        return wrapRes;
    }
};