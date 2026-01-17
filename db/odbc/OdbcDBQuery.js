"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdbcDBQuery = void 0;
const KnDBUtils_1 = require("../KnDBUtils");
class OdbcDBQuery {
    static removeAttributes(rows) {
        const fieldnames = ["statement", "parameters", "return", "count", "columns"];
        fieldnames.forEach(function (name) {
            if (rows.hasOwnProperty(name)) {
                delete rows[name];
            }
        });
    }
    static executeQuery(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils_1.KnDBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let columns = rows.columns;
                    this.removeAttributes(rows);
                    resolve({ rows: rows, columns: columns });
                }
            });
        });
    }
    static executeUpdate(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils_1.KnDBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let count = rows.count;
                    let columns = rows.columns;
                    resolve({ rows: { affectedRows: count }, columns: columns });
                }
            });
        });
    }
    static async statementQuery(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils_1.KnDBUtils.extractDBParam(params);
        const stm = await conn.createStatement();
        await stm.prepare(sql);
        await stm.bind(parameters);
        const rows = await stm.execute();
        let columns = rows.columns;
        this.removeAttributes(rows);
        return { rows: rows, columns: columns };
    }
    static async statementUpdate(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils_1.KnDBUtils.extractDBParam(params);
        const stm = await conn.createStatement();
        await stm.prepare(sql);
        await stm.bind(parameters);
        const rows = await stm.execute();
        let count = rows.count;
        let columns = rows.columns;
        return { rows: { affectedRows: count }, columns: columns };
    }
    static beginWork(conn) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static commitWork(conn) {
        return new Promise((resolve, reject) => {
            conn.commit((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    static rollbackWork(conn) {
        return new Promise((resolve, reject) => {
            conn.rollback((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.OdbcDBQuery = OdbcDBQuery;
