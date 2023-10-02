"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsSQLDBConnection = void 0;
const MsSQLPoolManager_1 = require("./MsSQLPoolManager");
class MsSQLDBConnection {
    constructor(config) {
        this.config = config;
    }
    async getPool() {
        return await MsSQLPoolManager_1.MsSQLPoolManager.getPool(this.config);
    }
    async getConnection(transaction) {
        let pool = await this.getPool();
        if (transaction) {
            let request = transaction.request();
            request.transaction = transaction;
            return Promise.resolve(request);
        }
        return Promise.resolve(pool.request());
    }
    async getTransaction() {
        let pool = await this.getPool();
        return Promise.resolve(pool.transaction());
    }
    static releaseConnection(conn) {
        try {
            if (conn) {
                conn.close((err) => {
                    if (err)
                        console.error(err);
                });
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        MsSQLPoolManager_1.MsSQLPoolManager.destroy();
    }
}
exports.MsSQLDBConnection = MsSQLDBConnection;
