"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBUtils = void 0;
const will_util_1 = require("@willsofts/will-util");
const DBAlias_1 = require("./DBAlias");
const DBError_1 = require("./DBError");
class DBUtils {
    static parseDBTypes(type) {
        if (typeof type === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase(type, "INTEGER") || will_util_1.Utilities.equalsIgnoreCase(type, "NUMBER"))
                return DBAlias_1.DBTypes.INTEGER;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DECIMAL"))
                return DBAlias_1.DBTypes.DECIMAL;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BOOLEAN"))
                return DBAlias_1.DBTypes.BOOLEAN;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BIGINT"))
                return DBAlias_1.DBTypes.BIGINT;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "TEXT"))
                return DBAlias_1.DBTypes.TEXT;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DATE"))
                return DBAlias_1.DBTypes.DATE;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "TIME"))
                return DBAlias_1.DBTypes.TIME;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "DATETIME"))
                return DBAlias_1.DBTypes.DATETIME;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "BLOB"))
                return DBAlias_1.DBTypes.BLOB;
            if (will_util_1.Utilities.equalsIgnoreCase(type, "CLOB"))
                return DBAlias_1.DBTypes.CLOB;
            return DBAlias_1.DBTypes.STRING;
        }
        else {
            return type;
        }
    }
    static parseDBAlias(alias) {
        if (typeof alias === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase("MYSQL", alias))
                return DBAlias_1.DBAlias.MYSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("MYSQL2", alias))
                return DBAlias_1.DBAlias.MYSQL2;
            if (will_util_1.Utilities.equalsIgnoreCase("MSSQL", alias))
                return DBAlias_1.DBAlias.MSSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("ODBC", alias))
                return DBAlias_1.DBAlias.ODBC;
            if (will_util_1.Utilities.equalsIgnoreCase("ORACLE", alias))
                return DBAlias_1.DBAlias.ORACLE;
            if (will_util_1.Utilities.equalsIgnoreCase("POSTGRES", alias))
                return DBAlias_1.DBAlias.POSTGRES;
            if (will_util_1.Utilities.equalsIgnoreCase("SQLITE", alias))
                return DBAlias_1.DBAlias.SQLITE;
            throw new DBError_1.DBError("Unknown alias '" + alias + "'", -10201);
        }
        else {
            return alias;
        }
    }
    static parseDBDialect(dialect) {
        if (typeof dialect === "string") {
            if (will_util_1.Utilities.equalsIgnoreCase("mysql", dialect))
                return DBAlias_1.DBDialect.MYSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("mssql", dialect))
                return DBAlias_1.DBDialect.MSSQL;
            if (will_util_1.Utilities.equalsIgnoreCase("oracle", dialect))
                return DBAlias_1.DBDialect.ORACLE;
            if (will_util_1.Utilities.equalsIgnoreCase("postgres", dialect))
                return DBAlias_1.DBDialect.POSTGRES;
            if (will_util_1.Utilities.equalsIgnoreCase("informix", dialect))
                return DBAlias_1.DBDialect.INFORMIX;
            if (will_util_1.Utilities.equalsIgnoreCase("db2", dialect))
                return DBAlias_1.DBDialect.DB2;
            if (will_util_1.Utilities.equalsIgnoreCase("sqlite", dialect))
                return DBAlias_1.DBDialect.SQLITE;
            throw new DBError_1.DBError("Unknown dialect '" + dialect + "'", -10202);
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
        if (paramType == DBAlias_1.DBTypes.DECIMAL || paramType == DBAlias_1.DBTypes.BIGINT || paramType == DBAlias_1.DBTypes.INTEGER) {
            return will_util_1.Utilities.parseFloat(param.value);
        }
        else if (paramType == DBAlias_1.DBTypes.DATE || paramType == DBAlias_1.DBTypes.DATETIME) {
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
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.MYSQL;
    }
    static isDB2(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.DB2;
    }
    static isMSSQL(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.MSSQL;
    }
    static isINFORMIX(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.INFORMIX;
    }
    static isORACLE(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.ORACLE;
    }
    static isPOSTGRES(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.POSTGRES;
    }
    static isSQLITE(config) {
        return this.parseDBDialect(config.dialect) == DBAlias_1.DBDialect.SQLITE;
    }
}
exports.DBUtils = DBUtils;
