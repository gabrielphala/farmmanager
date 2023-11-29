import { SQLifier, SQLDate } from "sqlifier"

export default new (class Announcement extends SQLifier {
    constructor () {
        super();

        this.schema('announcement', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            sender_id: { type: 'int' },
            sender_type: { type: 'varchar', length: 20 },
            farm_id: { type: 'int', ref: 'Farm' },
            subject: { type: 'varchar', length: 255 },
            message: { type: 'varchar', length: 1024 },
            isDeleted: { type: 'boolean', default: false },
            createdOn: { type: 'datetime', default: SQLDate.now }
        })
    }
})