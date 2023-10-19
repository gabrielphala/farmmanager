"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class User extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('task', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            lead_employee_id: { type: 'int', ref: 'user' },
            farm_id: { type: 'int', ref: 'farm' },
            objective: { type: 'varchar', length: 136 },
            progress: { type: 'varchar', length: 50, default: 'ongoing' },
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
});
//# sourceMappingURL=Task.js.map