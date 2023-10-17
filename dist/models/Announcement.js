"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class Announcement extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('announcement', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            sender_id: { type: 'int', ref: 'User' },
            farm_id: { type: 'int', ref: 'Farm' },
            subject: { type: 'varchar', length: 255 },
            message: { type: 'varchar', length: 1024 }
        });
    }
});
//# sourceMappingURL=Announcement.js.map