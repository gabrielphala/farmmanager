"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class DepartmentManager extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('department_manager', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            department: { type: 'varchar', length: 55 },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
    getDepartmentManagers(farmId) {
        return this.find({
            condition: { farm_id: farmId, isDeleted: false }
        });
    }
});
//# sourceMappingURL=DepartmentManager.js.map