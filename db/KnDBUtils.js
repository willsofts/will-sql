"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBUtils = void 0;
const will_util_1 = require("@willsofts/will-util");
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBError_1 = require("./KnDBError");
class KnDBUtils {
    static parseDBTypes(type) {
        if (typeof type !== "string") {
            return type;
        }
        const t = type.toUpperCase();
        const typeMap = {
            INTEGER: KnDBAlias_1.KnDBTypes.INTEGER,
            NUMBER: KnDBAlias_1.KnDBTypes.INTEGER,
            DECIMAL: KnDBAlias_1.KnDBTypes.DECIMAL,
            BOOLEAN: KnDBAlias_1.KnDBTypes.BOOLEAN,
            BIGINT: KnDBAlias_1.KnDBTypes.BIGINT,
            TEXT: KnDBAlias_1.KnDBTypes.TEXT,
            DATE: KnDBAlias_1.KnDBTypes.DATE,
            TIME: KnDBAlias_1.KnDBTypes.TIME,
            DATETIME: KnDBAlias_1.KnDBTypes.DATETIME,
            BLOB: KnDBAlias_1.KnDBTypes.BLOB,
            CLOB: KnDBAlias_1.KnDBTypes.CLOB
        };
        return typeMap[t] ?? KnDBAlias_1.KnDBTypes.STRING;
    }
    static parseDBAlias(alias) {
        if (typeof alias !== "string") {
            return alias;
        }
        const key = alias.toUpperCase();
        const aliasMap = {
            MYSQL: KnDBAlias_1.KnDBAlias.MYSQL,
            MYSQL2: KnDBAlias_1.KnDBAlias.MYSQL2,
            MSSQL: KnDBAlias_1.KnDBAlias.MSSQL,
            ODBC: KnDBAlias_1.KnDBAlias.ODBC,
            ORACLE: KnDBAlias_1.KnDBAlias.ORACLE,
            POSTGRES: KnDBAlias_1.KnDBAlias.POSTGRES,
            SQLITE: KnDBAlias_1.KnDBAlias.SQLITE
        };
        const result = aliasMap[key];
        if (result === undefined) {
            throw new KnDBError_1.KnDBError(`Unknown alias '${alias}'`, -10201);
        }
        return result;
    }
    static parseDBDialect(dialect) {
        if (typeof dialect !== "string") {
            return dialect;
        }
        const key = dialect.toUpperCase();
        const dialectMap = {
            MYSQL: KnDBAlias_1.KnDBDialect.MYSQL,
            MSSQL: KnDBAlias_1.KnDBDialect.MSSQL,
            ORACLE: KnDBAlias_1.KnDBDialect.ORACLE,
            POSTGRES: KnDBAlias_1.KnDBDialect.POSTGRES,
            INFORMIX: KnDBAlias_1.KnDBDialect.INFORMIX,
            DB2: KnDBAlias_1.KnDBDialect.DB2,
            SQLITE: KnDBAlias_1.KnDBDialect.SQLITE
        };
        const result = dialectMap[key];
        if (result === undefined) {
            throw new KnDBError_1.KnDBError(`Unknown dialect '${dialect}'`, -10202);
        }
        return result;
    }
    static parseSQLOptions(query) {
        if (typeof query === "string") {
            return undefined;
        }
        else {
            return query;
        }
    }
    static parseParamValue(param, dialect) {
        let paramType = this.parseDBTypes(param.type);
        if (paramType == KnDBAlias_1.KnDBTypes.DECIMAL || paramType == KnDBAlias_1.KnDBTypes.BIGINT || paramType == KnDBAlias_1.KnDBTypes.INTEGER) {
            return will_util_1.Utilities.parseFloat(param.value);
        }
        else if (paramType == KnDBAlias_1.KnDBTypes.DATE || paramType == KnDBAlias_1.KnDBTypes.DATETIME) {
            return will_util_1.Utilities.parseDate(param.value);
        }
        else if (paramType == KnDBAlias_1.KnDBTypes.TIME) {
            if (param.value instanceof Date && "pg" == dialect) {
                return will_util_1.Utilities.getHMS(param.value);
            }
        }
        return param.value;
    }
    static getQuery(query) {
        if (typeof query === "string") {
            return query;
        }
        else {
            return query.sql;
        }
    }
    static extractDBParam(params, dialect) {
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if (params) {
            for (let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(this.parseParamValue(pv, dialect));
                paratypes.push(pv.type);
            }
        }
        return [paravalues, paranames, paratypes];
    }
    static isSQLInterface(element) {
        return will_util_1.Utilities.hasAttributes(element, ["sql", "params"]) &&
            typeof element.sql === "string" &&
            typeof element.params === "object";
    }
    static isMYSQL(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.MYSQL;
    }
    static isDB2(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.DB2;
    }
    static isMSSQL(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.MSSQL;
    }
    static isINFORMIX(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.INFORMIX;
    }
    static isORACLE(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.ORACLE;
    }
    static isPOSTGRES(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.POSTGRES;
    }
    static isSQLITE(config) {
        return this.parseDBDialect(config.dialect) == KnDBAlias_1.KnDBDialect.SQLITE;
    }
    static hasIntensiveQuery(query) {
        if (!query || query.trim().length == 0)
            return false;
        let q = query.toLowerCase();
        return q.includes("insert") || q.includes("update") || q.includes("delete") || q.includes("drop") || q.includes("alter") || q.includes("execute") || q.includes("exec") || q.includes("truncate");
    }
}
exports.KnDBUtils = KnDBUtils;
