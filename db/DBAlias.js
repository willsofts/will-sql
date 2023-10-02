"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBParamValue = exports.DBTypes = exports.DBDialect = exports.DBAlias = void 0;
var DBAlias;
(function (DBAlias) {
    DBAlias["MYSQL"] = "MYSQL";
    DBAlias["MSSQL"] = "MSSQL";
    DBAlias["ODBC"] = "ODBC";
    DBAlias["ORACLE"] = "ORACLE";
    DBAlias["POSTGRES"] = "POSTGRES";
    DBAlias["SQLITE"] = "SQLITE";
    DBAlias["MYSQL2"] = "MYSQL2";
})(DBAlias || (DBAlias = {}));
exports.DBAlias = DBAlias;
var DBDialect;
(function (DBDialect) {
    DBDialect["MYSQL"] = "mysql";
    DBDialect["MSSQL"] = "mssql";
    DBDialect["ORACLE"] = "oracle";
    DBDialect["POSTGRES"] = "postgres";
    DBDialect["INFORMIX"] = "informix";
    DBDialect["DB2"] = "db2";
    DBDialect["SQLITE"] = "sqlite";
})(DBDialect || (DBDialect = {}));
exports.DBDialect = DBDialect;
var DBTypes;
(function (DBTypes) {
    DBTypes["STRING"] = "STRING";
    DBTypes["INTEGER"] = "INTEGER";
    DBTypes["DECIMAL"] = "DECIMAL";
    DBTypes["BOOLEAN"] = "BOOLEAN";
    DBTypes["BIGINT"] = "BIGINT";
    DBTypes["TEXT"] = "TEXT";
    DBTypes["DATE"] = "DATE";
    DBTypes["TIME"] = "TIME";
    DBTypes["DATETIME"] = "DATETIME";
    DBTypes["BLOB"] = "BLOB";
    DBTypes["CLOB"] = "CLOB";
})(DBTypes || (DBTypes = {}));
exports.DBTypes = DBTypes;
class DBParamValue {
    constructor(value, type = DBTypes.STRING) {
        this.value = value;
        this.type = type;
    }
}
exports.DBParamValue = DBParamValue;
