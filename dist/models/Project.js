"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class User extends sqlifier_1.SQLifier {
    constructor() {
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
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
});
//# sourceMappingURL=Project.js.map