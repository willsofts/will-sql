"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBParamValue = exports.KnDBTypes = exports.KnDBDialect = exports.KnDBAlias = void 0;
var KnDBAlias;
(function (KnDBAlias) {
    KnDBAlias["MYSQL"] = "MYSQL";
    KnDBAlias["MSSQL"] = "MSSQL";
    KnDBAlias["ODBC"] = "ODBC";
    KnDBAlias["ORACLE"] = "ORACLE";
    KnDBAlias["POSTGRES"] = "POSTGRES";
    KnDBAlias["SQLITE"] = "SQLITE";
    KnDBAlias["MYSQL2"] = "MYSQL2";
})(KnDBAlias || (KnDBAlias = {}));
exports.KnDBAlias = KnDBAlias;
var KnDBDialect;
(function (KnDBDialect) {
    KnDBDialect["MYSQL"] = "mysql";
    KnDBDialect["MSSQL"] = "mssql";
    KnDBDialect["ORACLE"] = "oracle";
    KnDBDialect["POSTGRES"] = "postgres";
    KnDBDialect["INFORMIX"] = "informix";
    KnDBDialect["DB2"] = "db2";
    KnDBDialect["SQLITE"] = "sqlite";
})(KnDBDialect || (KnDBDialect = {}));
exports.KnDBDialect = KnDBDialect;
var KnDBTypes;
(function (KnDBTypes) {
    KnDBTypes["STRING"] = "STRING";
    KnDBTypes["INTEGER"] = "INTEGER";
    KnDBTypes["DECIMAL"] = "DECIMAL";
    KnDBTypes["BOOLEAN"] = "BOOLEAN";
    KnDBTypes["BIGINT"] = "BIGINT";
    KnDBTypes["TEXT"] = "TEXT";
    KnDBTypes["DATE"] = "DATE";
    KnDBTypes["TIME"] = "TIME";
    KnDBTypes["DATETIME"] = "DATETIME";
    KnDBTypes["BLOB"] = "BLOB";
    KnDBTypes["CLOB"] = "CLOB";
})(KnDBTypes || (KnDBTypes = {}));
exports.KnDBTypes = KnDBTypes;
class KnDBParamValue {
    constructor(value, type = KnDBTypes.STRING) {
        this.value = value;
        this.type = type;
    }
}
exports.KnDBParamValue = KnDBParamValue;
