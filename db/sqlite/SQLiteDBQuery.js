"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class SQLiteDBQuery {
    static executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.all(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let columns = null;
                    resolve({ rows: rows, columns: columns });
                }
            });
        });
    }
    static executeUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.run(sql, parameters, (rows, qerr) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let count = rows?.changes;
                    let columns = null;
                    resolve({ rows: { affectedRows: count }, columns: columns });
                }
            });
        });
    }
    static async statementQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        const stm = conn.prepare(sql);
        const rows = stm.all(parameters);
        return Promise.resolve({ rows: rows, columns: null });
    }
    static async statementUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        const stm = conn.prepare(sql);
        const rows = stm.run(parameters);
        let count = rows?.changes;
        return Promise.resolve({ rows: { affectedRows: count }, columns: null });
    }
    static beginWork(conn) {
        return Promise.resolve();
    }
    static commitWork(conn) {
        return Promise.resolve();
    }
    static rollbackWork(conn) {
        return Promise.resolve();
    }
}
exports.SQLiteDBQuery = SQLiteDBQuery;
