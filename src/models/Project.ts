import { SQLifier, SQLDate } from "sqlifier"

export default new (class User extends SQLifier {
    constructor () {
        super();

        this.schema('project', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int', ref: 'farm' },
            name: { type: 'varchar', length: 60 },
            department: { type: 'varchar', length: 60 },
            objective: { type: 'varchar', length: 136 },
            tasks_no: { type: 'int', default: 0 },
            tasks_completed_no: { type: 'int', default: 0 },
            status: { type: 'varchar', length: 50, default: 'pending' },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }
})