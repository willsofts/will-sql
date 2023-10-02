"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OraclePoolManager = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
class OraclePoolManager {
    static async getPool(dbcfg) {
        let pool = this.pools.get(dbcfg.schema);
        if (!pool) {
            pool = await oracledb_1.default.createPool({
                user: dbcfg.user,
                password: dbcfg.password,
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
exports.OraclePoolManager = OraclePoolManager;
OraclePoolManager.pools = new Map();
