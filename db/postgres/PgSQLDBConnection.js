"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSQLDBConnection = void 0;
const PgSQLPoolManager_1 = require("./PgSQLPoolManager");
class PgSQLDBConnection {
    constructor(config) {
        this.config = config;
    }
    getPool() {
        return PgSQLPoolManager_1.PgSQLPoolManager.getPool(this.config);
    }
    getConnection() {
        let pool = this.getPool();
        return new Promise((resolve, reject) => {
            pool.connect((cerr, conn) => {
                if (cerr) {
                    if (conn)
                        PgSQLDBConnection.releaseConnection(conn);
                    reject(cerr);
                }
                else {
                    resolve(conn);
                }
            });
        });
    }
    getConnectionAsync(callback) {
        let pool = this.getPool();
        pool.connect((cerr, conn) => {
            if (cerr) {
                if (conn)
                    PgSQLDBConnection.releaseConnection(conn);
                callback(cerr, null);
            }
            else {
                callback(null, conn);
            }
        });
    }
    static releaseConnection(conn) {
        try {
            conn.release();
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        PgSQLPoolManager_1.PgSQLPoolManager.destroy();
    }
}
exports.PgSQLDBConnection = PgSQLDBConnection;
