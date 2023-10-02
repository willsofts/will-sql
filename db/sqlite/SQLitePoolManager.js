"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLitePoolManager = void 0;
const sqlite3_1 = require("sqlite3");
class SQLitePoolManager {
    static getPool(dbcfg) {
        let db = this.pools.get(dbcfg.schema);
        if (!db) {
            db = new sqlite3_1.Database(dbcfg.url);
            this.pools.set(dbcfg.schema, db);
        }
        return db;
    }
    static remove(schema) {
        let pool = this.pools.get(schema);
        if (pool) {
            pool.close((err) => {
            });
            this.pools.delete(schema);
        }
    }
    static destroy() {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool) => {
            return pool.close((err) => {
            });
        }));
        this.pools.clear();
    }
}
exports.SQLitePoolManager = SQLitePoolManager;
SQLitePoolManager.pools = new Map();
