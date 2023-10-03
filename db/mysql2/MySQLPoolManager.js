"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPoolManager = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
class MySQLPoolManager {
    static getPool(dbcfg) {
        let pool = this.pools.get(dbcfg.schema);
        if (!pool) {
            pool = mysql2_1.default.createPool({
                user: dbcfg.user,
                password: dbcfg.password,
                host: dbcfg.host,
                port: dbcfg.port,
                database: dbcfg.database,
                ...dbcfg.options
            });
            this.pools.set(dbcfg.schema, pool);
        }
        return pool;
    }
    static remove(schema) {
        let pool = this.pools.get(schema);
        if (pool) {
            pool.end((err) => {
            });
            this.pools.delete(schema);
        }
    }
    static destroy() {
        let poolary = Array.from(this.pools.values());
        Promise.all(poolary.map((pool) => {
            return pool.end((err) => {
            });
        }));
        this.pools.clear();
    }
}
exports.MySQLPoolManager = MySQLPoolManager;
MySQLPoolManager.pools = new Map();
