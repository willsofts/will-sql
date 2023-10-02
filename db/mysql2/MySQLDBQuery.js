"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class MySQLDBQuery {
    static executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
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
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        return new Promise((resolve, reject) => {
            conn.query(sql, parameters, (qerr, rows, fields) => {
                if (qerr) {
                    reject(qerr);
                }
                else {
                    let r = rows;
                    resolve({ rows: { affectedRows: r.affectedRows }, columns: fields });
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
