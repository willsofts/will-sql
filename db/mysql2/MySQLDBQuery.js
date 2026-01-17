"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDBQuery = void 0;
const KnDBUtils_1 = require("../KnDBUtils");
class MySQLDBQuery {
    static isResultSet(result) {
        return (typeof result === "object" &&
            result !== null &&
            "affectedRows" in result);
    }
    static executeQuery(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils_1.KnDBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows, fields) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    resolve({ rows: rows, columns: fields });
                }
            });
        });
    }
    static executeUpdate(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = Array.isArray(params) ? [params] : KnDBUtils_1.KnDBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows, fields) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let affectedRows = this.isResultSet(rows) ? rows.affectedRows : 0;
                    resolve({ rows: { affectedRows: affectedRows }, columns: fields });
                }
            });
        });
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
exports.MySQLDBQuery = MySQLDBQuery;
