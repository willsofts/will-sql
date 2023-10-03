"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdbcDBConnection = void 0;
const OdbcPoolManager_1 = require("./OdbcPoolManager");
class OdbcDBConnection {
    constructor(config) {
        this.config = config;
    }
    async getPool() {
        return await OdbcPoolManager_1.OdbcPoolManager.getPool(this.config);
    }
    async getConnection() {
        let pool = await this.getPool();
        return await pool.connect();
    }
    async getConnectionAsync(callback) {
        let pool = await this.getPool();
        pool.connect((cerr, conn) => {
            if (cerr) {
                callback(cerr, null);
            }
            else {
                callback(null, conn);
            }
        });
    }
    static releaseConnection(conn) {
        if (conn) {
            conn.close((err) => {
                if (err)
                    console.error(err);
            });
        }
    }
    static releasePool() {
        OdbcPoolManager_1.OdbcPoolManager.destroy();
    }
}
exports.OdbcDBConnection = OdbcDBConnection;
