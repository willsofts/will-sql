"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDBQuery = void 0;
const KnDBUtils_1 = require("../KnDBUtils");
class MySQLDBQuery {
    static executeQuery(conn, query, params) {
        let sql = KnDBUtils_1.KnDBUtils.getQuery(query);
        let [parameters] = KnDBUtils_1.KnDBUtils.extractDBParam(params);
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
        let [parameters] = KnDBUtils_1.KnDBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows, fields) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    resolve({ rows: { affectedRows: rows.affectedRows }, columns: fields });
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
