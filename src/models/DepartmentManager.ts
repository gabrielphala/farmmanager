import { SQLifier, SQLDate } from "sqlifier"

export default new (class DepartmentManager extends SQLifier {
    constructor () {
        super();

        this.schema('department_manager', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            department: { type: 'varchar', length: 55 },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }

	getDepartmentManagers (farmId: number) {
        return this.find({
            condition: { farm_id: farmId, isDeleted: false }
        });
    }
})