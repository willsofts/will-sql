"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDBConnection = void 0;
const SQLitePoolManager_1 = require("./SQLitePoolManager");
class SQLiteDBConnection {
    constructor(config) {
        this.config = config;
    }
    getPool() {
        return SQLitePoolManager_1.SQLitePoolManager.getPool(this.config);
    }
    getConnection() {
        return this.getPool();
    }
    getConnectionAsync(callback) {
        let conn = this.getPool();
        callback(null, conn);
    }
    remove() {
        SQLitePoolManager_1.SQLitePoolManager.remove(this.config.schema);
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
        SQLitePoolManager_1.SQLitePoolManager.destroy();
    }
}
exports.SQLiteDBConnection = SQLiteDBConnection;
