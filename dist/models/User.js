"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class User extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('user', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            department: { type: 'varchar', length: 55 },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            role: { type: 'varchar', length: 30 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
    getProjectManagers(farmId) {
        return this.find({
            condition: { role: 'Project manager', farm_id: farmId, isDeleted: false }
        });
    }
    getDepartmentManagers(farmId) {
        return this.find({
            condition: { role: 'Department manager', farm_id: farmId, isDeleted: false }
        });
    }
    getDepartmentEmployees(farmId) {
        return this.find({
            condition: { role: 'Employee', farm_id: farmId, isDeleted: false }
        });
    }
    getDepartmentEmployeesByDepartment(farmId, department) {
        return this.find({
            condition: { role: 'Employee', department, farm_id: farmId, isDeleted: false }
        });
    }
});
//# sourceMappingURL=User.js.map