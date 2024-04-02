"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLPoolManager = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const will_util_1 = __importDefault(require("@willsofts/will-util"));
const CAST_DB_TYPES = will_util_1.default.env("CAST_DB_TYPES", "DECIMAL,JSON");
const CAST_DB_TYPES_DECIMAL = CAST_DB_TYPES.indexOf("DECIMAL") >= 0;
const CAST_DB_TYPES_JSON = CAST_DB_TYPES.indexOf("JSON") >= 0;
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
                typeCast: function (field, next) {
                    if (field.type == 'BIT' && field.length == 1) {
                        let value = field.buffer();
                        return (value === null) ? null : value[0] === 1;
                    }
                    else if (CAST_DB_TYPES_DECIMAL && (field.type == "DECIMAL" || field.type == "NEWDECIMAL")) {
                        let value = field.string();
                        return (value === null) ? null : Number(value);
                    }
                    else if (CAST_DB_TYPES_JSON && field.type == 'JSON') {
                        let value = field.string();
                        return (value === null) ? null : JSON.parse(value.toString('utf8'));
                    }
                    return next();
                },
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
