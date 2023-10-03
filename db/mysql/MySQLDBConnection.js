"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLDBConnection = void 0;
const MySQLPoolManager_1 = require("./MySQLPoolManager");
class MySQLDBConnection {
    constructor(config) {
        this.config = config;
    }
    getPool() {
        return MySQLPoolManager_1.MySQLPoolManager.getPool(this.config);
    }
    getConnection() {
        let pool = this.getPool();
        return new Promise((resolve, reject) => {
            pool.getConnection((cerr, conn) => {
                if (cerr) {
                    if (conn)
                        MySQLDBConnection.releaseConnection(conn);
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
        pool.getConnection((cerr, conn) => {
            if (cerr) {
                if (conn)
                    MySQLDBConnection.releaseConnection(conn);
                callback(cerr, null);
            }
            else {
                callback(null, conn);
            }
        });
    }
    static releaseConnection(conn) {
        try {
            let pconn = conn;
            //pconn.release(); 
            pconn.destroy();
        }
        catch (ex) {
            console.error(ex);
        }
    }
    static releasePool() {
        MySQLPoolManager_1.MySQLPoolManager.destroy();
    }
}
exports.MySQLDBConnection = MySQLDBConnection;
