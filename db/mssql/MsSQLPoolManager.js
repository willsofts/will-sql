"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsSQLPoolManager = void 0;
const mssql_1 = __importDefault(require("mssql"));
class MsSQLPoolManager {
    static async getPool(dbcfg) {
        let pool = this.pools.get(dbcfg.schema);
        if (!pool) {
            let appool = new mssql_1.default.ConnectionPool(dbcfg.url);
            pool = await appool.connect();
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
exports.MsSQLPoolManager = MsSQLPoolManager;
MsSQLPoolManager.pools = new Map();
