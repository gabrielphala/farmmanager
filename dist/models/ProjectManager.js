"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlifier_1 = require("sqlifier");
exports.default = new (class ProjectManager extends sqlifier_1.SQLifier {
    constructor() {
        super();
        this.schema('project_manager', {
            id: { type: 'int', isAutoIncrement: true, isPrimary: true },
            farm_id: { type: 'int' },
            project_id: { type: 'int' },
            fullname: { type: 'varchar', length: 55 },
            email: { type: 'varchar', length: 50 },
            password: { type: 'varchar', length: 250 },
            createdOn: { type: 'datetime', default: sqlifier_1.SQLDate.now },
            isDeleted: { type: 'boolean', default: false }
        });
    }
    getProjectManagers(farmId) {
        return this.find({
            condition: { farm_id: farmId, isDeleted: false }
        });
    }
});
//# sourceMappingURL=ProjectManager.js.map