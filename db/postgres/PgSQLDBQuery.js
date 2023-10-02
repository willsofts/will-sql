"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSQLDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class PgSQLDBQuery {
    static executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    resolve({ rows: rows.rows, columns: rows.fields });
                }
            });
        });
    }
    static executeUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    resolve({ rows: { affectedRows: rows.rowCount }, columns: rows.fields });
                }
            });
        });
    }
    static async beginWork(conn) {
        await conn.query("BEGIN");
    }
    static async commitWork(conn) {
        await conn.query("COMMIT");
    }
    static async rollbackWork(conn) {
        await conn.query("ROLLBACK");
    }
}
exports.PgSQLDBQuery = PgSQLDBQuery;
