import fs from 'fs'
import ejs from 'ejs'
import path from 'path'

export default class DownloadService {
    static async download (wrap_res, body) {
        try {
            const html = await ejs.renderFile(
                path.join(__dirname, '../../public/assets/docs/csv.ejs'), {
                data: body.data,
                tableHeader: body.tableHeader,
                allowedColumns: body.allowedColumns
            });

            const filename = `A_${body.reportName || 'basic'}_Report_${Date.now()}.csv`;

            const filePath = path.join(
                __dirname,
                `../../public/assets/downloads/tmp/`
            );

            fs.writeFileSync(filePath + filename, html.trimStart())

            wrap_res.filename = filename;
            wrap_res.successful = true;

            return wrap_res;
        } catch (e) { throw e; }
    }
}