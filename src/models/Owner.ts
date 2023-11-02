import { SQLifier, SQLDate } from "sqlifier"

export default new (class Owner extends SQLifier {
    constructor () {
        super();

        this.schema('owner', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        })
    }
})