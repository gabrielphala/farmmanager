import { SQLifier } from "sqlifier"

export default new (class Department extends SQLifier {
    constructor () {
        super();

        this.schema('farm', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            name: { type: 'varchar', length: 15 },
            manager: { type: 'int', ref: 'User' }
        })
    }
})