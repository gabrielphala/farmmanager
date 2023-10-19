import { SQLifier, SQLDate } from "sqlifier"

export default new (class User extends SQLifier {
    constructor () {
        super();

        this.schema('user', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            department: { type: 'varchar', length: 55 },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            role: { type: 'varchar', length: 30 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }

    getProjectManagers (farmId: number) {
        return this.find({
            condition:  { role: 'Project manager', farm_id: farmId, isDeleted: false }
        });
    }

    getDepartmentManagers (farmId: number) {
        return this.find({
            condition: { role: 'Department manager', farm_id: farmId, isDeleted: false }
        });
    }

    getDepartmentEmployees (farmId: number) {
        return this.find({
            condition: { role: 'Employee', farm_id: farmId, isDeleted: false }
        });
    }
})