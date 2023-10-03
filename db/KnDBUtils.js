"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBUtils = void 0;
const will_util_1 = require("@willsofts/will-util");
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBError_1 = require("./KnDBError");
class KnDBUtils {
    static parseDBTypes(type) {
        if (typeof type === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase(type, "INTEGER") || will_util_1.Utilities.equalsIgnoreCase(type, "NUMBER"))
                return KnDBAlias_1.KnDBTypes.INTEGER;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DECIMAL"))
                return KnDBAlias_1.KnDBTypes.DECIMAL;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BOOLEAN"))
                return KnDBAlias_1.KnDBTypes.BOOLEAN;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BIGINT"))
                return KnDBAlias_1.KnDBTypes.BIGINT;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "TEXT"))
                return KnDBAlias_1.KnDBTypes.TEXT;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DATE"))
                return KnDBAlias_1.KnDBTypes.DATE;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "TIME"))
                return KnDBAlias_1.KnDBTypes.TIME;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DATETIME"))
                return KnDBAlias_1.KnDBTypes.DATETIME;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BLOB"))
                return KnDBAlias_1.KnDBTypes.BLOB;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "CLOB"))
                return KnDBAlias_1.KnDBTypes.CLOB;
            return KnDBAlias_1.KnDBTypes.STRING;
        }
        else {
            return type;
        }
    }
    static parseDBAlias(alias) {
        if (typeof alias === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase("MYSQL", alias))
                return KnDBAlias_1.KnDBAlias.MYSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("MYSQL2", alias))
                return KnDBAlias_1.KnDBAlias.MYSQL2;
            if (will_util_1.Utilities.equalsIgnoreCase("MSSQL", alias))
                return KnDBAlias_1.KnDBAlias.MSSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("ODBC", alias))
                return KnDBAlias_1.KnDBAlias.ODBC;
            if (will_util_1.Utilities.equalsIgnoreCase("ORACLE", alias))
                return KnDBAlias_1.KnDBAlias.ORACLE;
            if (will_util_1.Utilities.equalsIgnoreCase("POSTGRES", alias))
                return KnDBAlias_1.KnDBAlias.POSTGRES;
            if (will_util_1.Utilities.equalsIgnoreCase("SQLITE", alias))
                return KnDBAlias_1.KnDBAlias.SQLITE;
            throw new KnDBError_1.KnDBError("Unknown alias '" + alias + "'", -10201);
        }
        else {
            return alias;
        }
    }
    static parseDBDialect(dialect) {
        if (typeof dialect === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase("mysql", dialect))
                return KnDBAlias_1.KnDBDialect.MYSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("mssql", dialect))
                return KnDBAlias_1.KnDBDialect.MSSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("oracle", dialect))
                return KnDBAlias_1.KnDBDialect.ORACLE;
            if (will_util_1.Utilities.equalsIgnoreCase("postgres", dialect))
                return KnDBAlias_1.KnDBDialect.POSTGRES;
            if (will_util_1.Utilities.equalsIgnoreCase("informix", dialect))
                return KnDBAlias_1.KnDBDialect.INFORMIX;
            if (will_util_1.Utilities.equalsIgnoreCase("db2", dialect))
                return KnDBAlias_1.KnDBDialect.DB2;
            if (will_util_1.Utilities.equalsIgnoreCase("sqlite", dialect))
                return KnDBAlias_1.KnDBDialect.SQLITE;
            throw new KnDBError_1.KnDBError("Unknown dialect '" + dialect + "'", -10202);
        }
        else {
            return dialect;
        }
    }
    static parseSQLOptions(query) {
        if (typeof query === "string") {
            return undefined;
        }
        else {
            return query;
        }
    }
    static parseParamValue(param) {
        let paramType = this.parseDBTypes(param.type);
        if (paramType == KnDBAlias_1.KnDBTypes.DECIMAL || paramType == KnDBAlias_1.KnDBTypes.BIGINT || paramType == KnDBAlias_1.KnDBTypes.INTEGER) {
            return will_util_1.Utilities.parseFloat(param.value);
        }
        else if (paramType == KnDBAlias_1.KnDBTypes.DATE || paramType == KnDBAlias_1.KnDBTypes.DATETIME) {
            return will_util_1.Utilities.parseDate(param.value);
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
    static extractDBParam(params) {
        let paravalues = [];
        let paranames = [];
        let paratypes = [];
        if (params) {
            for (let p in params) {
                let pv = params[p];
                paranames.push(p);
                paravalues.push(this.parseParamValue(pv));
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
}
exports.KnDBUtils = KnDBUtils;
