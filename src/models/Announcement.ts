import { SQLifier } from "sqlifier"

export default new (class Announcement extends SQLifier {
    constructor () {
        super();

        this.schema('announcement', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            sender_id: { type: 'int', ref: 'User' },
            farm_id: { type: 'int', ref: 'Farm' },
            subject: { type: 'varchar', length: 255 },
            message: { type: 'varchar', length: 1024 }
        })
    }
})