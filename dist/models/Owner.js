"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class Owner extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('owner', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
});
//# sourceMappingURL=Owner.js.map