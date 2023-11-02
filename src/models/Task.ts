import { SQLifier, SQLDate } from "sqlifier"

export default new (class User extends SQLifier {
    constructor () {
        super();

        this.schema('task', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            lead_employee_id: { type: 'int', ref: 'employee' },
            farm_id: { type: 'int', ref: 'farm' },
            project_id: { type: 'int', ref: 'project' },
            objective: { type: 'varchar', length: 136 },
            progress: { type: 'varchar', length: 50, default: 'pending' },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }
})