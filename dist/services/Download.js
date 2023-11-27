"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
class DownloadService {
    static async download(wrap_res, body) {
        try {
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, '../../public/assets/docs/csv.ejs'), {
                data: body.data,
                tableHeader: body.tableHeader,
                allowedColumns: body.allowedColumns
            });
            const filename = `A_${body.reportName || 'basic'}_Report_${Date.now()}.csv`;
            const filePath = path_1.default.join(__dirname, `../../public/assets/downloads/tmp/`);
            fs_1.default.writeFileSync(filePath + filename, html.trimStart());
            wrap_res.filename = filename;
            wrap_res.successful = true;
            return wrap_res;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = DownloadService;
//# sourceMappingURL=Download.js.map