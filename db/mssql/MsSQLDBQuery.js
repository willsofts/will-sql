"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsSQLDBQuery = void 0;
const DBUtils_1 = require("../DBUtils");
class MsSQLDBQuery {
    static assignParameters(conn, params) {
        if (params) {
            for (let p in params) {
                let pv = params[p];
                let paraValue = DBUtils_1.DBUtils.parseParamValue(pv);
                try {
                    conn.input(p, paraValue);
                }
                catch (ex) {
                    conn.parameters[p].value = paraValue;
                }
            }
        }
    }
    static async executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let req = conn;
        req.arrayRowMode = true;
        let result = await conn.query(sql);
        let rows = result.recordset;
        let cols = result.columns[0];
        for (let idx in rows) {
            let row = rows[idx];
            let json = {};
            cols.forEach((col) => {
                json[col.name] = row[col.index];
            });
            rows[idx] = json;
        }
        ;
        return Promise.resolve({ rows: rows, columns: cols });
    }
    static async executeUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        this.assignParameters(conn, params);
        let result = await conn.query(sql);
        return Promise.resolve({ rows: { affectedRows: result.rowsAffected[0] }, columns: null });
    }
    static beginWork(conn) {
        return new Promise((resolve, reject) => {
            conn.transaction.begin(undefined, (err) => {
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
            conn.transaction.commit((err) => {
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
            conn.transaction.rollback((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.MsSQLDBQuery = MsSQLDBQuery;
