import { SQLifier } from "sqlifier"

export default new (class Farm extends SQLifier {
    constructor () {
        super();

        this.schema('farm', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            name: { type: 'varchar', length: 15 },
            owner_id: { type: 'int', ref: 'user' }
        })
    }
})