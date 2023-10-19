import { SQLifier, SQLDate } from "sqlifier"

export default new (class User extends SQLifier {
    constructor () {
        super();

        this.schema('task', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            lead_employee_id: { type: 'int', ref: 'user' },
            farm_id: { type: 'int', ref: 'farm' },
            objective: { type: 'varchar', length: 136 },
            progress: { type: 'varchar', length: 50, default: 'ongoing' },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }
})