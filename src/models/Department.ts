import { SQLifier } from "sqlifier"

export default new (class Department extends SQLifier {
    constructor () {
        super();

        this.schema('department', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int', ref: 'farm' },
            name: { type: 'varchar', length: 15 }
        })
    }
})