"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleDBQuery = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const DBUtils_1 = require("../DBUtils");
class OracleDBQuery {
    static async executeQuery(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb_1.default.OUT_FORMAT_OBJECT,
            extendedMetaData: true
        });
        return Promise.resolve({ rows: result.rows, columns: result.metaData });
    }
    static async executeUpdate(conn, query, params) {
        let sql = DBUtils_1.DBUtils.getQuery(query);
        let [parameters] = DBUtils_1.DBUtils.extractDBParam(params);
        let result = await conn.execute(sql, parameters, {
            outFormat: oracledb_1.default.OUT_FORMAT_OBJECT,
            extendedMetaData: true
        });
        return Promise.resolve({ rows: { affectedRows: result.rowsAffected }, columns: null });
    }
    static beginWork(conn) {
        oracledb_1.default.autoCommit = false;
        return Promise.resolve();
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
exports.OracleDBQuery = OracleDBQuery;
