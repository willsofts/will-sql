"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdbcPoolManager = void 0;
const odbc = require("odbc");
class OdbcPoolManager {
    static async getPool(dbcfg) {
        let pool = this.pools.get(dbcfg.schema);
        if (!pool) {
            pool = await odbc.pool(dbcfg.url);
            this.pools.set(dbcfg.schema, pool);
        }
        return pool;
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
exports.OdbcPoolManager = OdbcPoolManager;
OdbcPoolManager.pools = new Map();
