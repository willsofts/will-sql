"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleDBConnection = void 0;
const OraclePoolManager_1 = require("./OraclePoolManager");
class OracleDBConnection {
    constructor(config) {
        this.config = config;
    }
    async getPool() {
        return await OraclePoolManager_1.OraclePoolManager.getPool(this.config);
    }
    async getConnection() {
        let pool = await this.getPool();
        return new Promise((resolve, reject) => {
            pool.getConnection((cerr, conn) => {
                if (cerr) {
                    if (conn)
                        OracleDBConnection.releaseConnection(conn);
                    reject(cerr);
                }
                else {
                    resolve(conn);
                }
            });
        });
    }
    static releaseConnection(conn) {
        try {
            conn.close((cerr) => {
                if (cerr)
                    console.error("error", cerr);
            });
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        OraclePoolManager_1.OraclePoolManager.destroy();
    }
}
exports.OracleDBConnection = OracleDBConnection;
