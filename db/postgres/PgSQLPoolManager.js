"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSQLPoolManager = void 0;
const pg_1 = require("pg");
class PgSQLPoolManager {
    static getPool(dbcfg) {
        let pool = this.pools.get(dbcfg.schema);
        if (!pool) {
            pool = new pg_1.Pool({
                connectionString: dbcfg.url,
                ...dbcfg.options
            });
            this.pools.set(dbcfg.schema, pool);
        }
        return pool;
    }
    static remove(schema) {
        let pool = this.pools.get(schema);
        if (pool) {
            pool.end(() => {
            });
            this.pools.delete(schema);
        }
    }
    static destroy() {
        let poolary = Array.from(this.pools.values());
        poolary.forEach(pool => {
            pool.end(() => { });
        });
        this.pools.clear();
    }
}
exports.PgSQLPoolManager = PgSQLPoolManager;
PgSQLPoolManager.pools = new Map();
