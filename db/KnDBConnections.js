"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBConnector = exports.KnDBConnections = void 0;
const will_util_1 = __importStar(require("@willsofts/will-util"));
const KnDBVariable_1 = require("./KnDBVariable");
const KnDBError_1 = require("./KnDBError");
const KnDBConfig_1 = require("./KnDBConfig");
class KnDBConnections {
    static getDBConnector(configure) {
        configure = configure ?? { schema: KnDBVariable_1.DB_SCHEMA, alias: KnDBVariable_1.DB_ALIAS, dialect: KnDBVariable_1.DB_DIALECT, url: KnDBVariable_1.DB_URL, user: KnDBVariable_1.DB_USER, password: KnDBVariable_1.DB_PASSWORD };
        if (typeof configure === "string") {
            if (will_util_1.default.has(configure)) {
                let section = will_util_1.default.get(configure);
                KnDBConfig_1.dbconfig.schema = configure;
                KnDBConfig_1.dbconfig.alias = section["alias"];
                KnDBConfig_1.dbconfig.dialect = section["dialect"];
                KnDBConfig_1.dbconfig.url = section["url"];
                KnDBConfig_1.dbconfig.user = section["user"];
                KnDBConfig_1.dbconfig.password = section["password"];
                KnDBConfig_1.dbconfig.host = section["host"];
                KnDBConfig_1.dbconfig.port = section["port"];
                KnDBConfig_1.dbconfig.database = section["database"];
                KnDBConfig_1.dbconfig.options = section["options"];
            }
            else {
                throw new KnDBError_1.KnDBError("Database configuration '" + configure + "' not found", -10001);
            }
        }
        else {
            KnDBConfig_1.dbconfig.schema = configure.schema;
            KnDBConfig_1.dbconfig.alias = configure.alias;
            KnDBConfig_1.dbconfig.dialect = configure.dialect;
            KnDBConfig_1.dbconfig.url = configure.url;
            KnDBConfig_1.dbconfig.user = configure.user;
            KnDBConfig_1.dbconfig.password = configure.password;
            KnDBConfig_1.dbconfig.host = configure.host;
            KnDBConfig_1.dbconfig.port = configure.port;
            KnDBConfig_1.dbconfig.database = configure.database;
            KnDBConfig_1.dbconfig.options = configure.options;
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "MYSQL")) {
            const MySQLDB = require("./mysql/MySQLDB");
            return new MySQLDB({ ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "MYSQL2")) {
            const MySQLDB = require("./mysql2/MySQLDB");
            return new MySQLDB({ ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "ODBC")) {
            const OdbcDB = require("./odbc/OdbcDB");
            return new OdbcDB(KnDBConfig_1.dbconfig.dialect, { ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "MSSQL")) {
            const MsSQLDB = require("./mssql/MsSQLDB");
            return new MsSQLDB({ ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "ORACLE")) {
            const OracleDB = require("./oracle/OracleDB");
            return new OracleDB({ ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "POSTGRES")) {
            const PgSQLDB = require("./postgres/PgSQLDB");
            return new PgSQLDB({ ...KnDBConfig_1.dbconfig });
        }
        if (will_util_1.Utilities.equalsIgnoreCase(KnDBConfig_1.dbconfig.alias, "SQLITE")) {
            const SQLiteDB = require("./sqlite/SQLiteDB");
            return new SQLiteDB({ ...KnDBConfig_1.dbconfig });
        }
        throw new KnDBError_1.KnDBError("Database alias '" + KnDBConfig_1.dbconfig.alias + "' not supported", -10002);
    }
}
exports.KnDBConnections = KnDBConnections;
function getDBConnector(section) {
    return KnDBConnections.getDBConnector(section);
}
exports.getDBConnector = getDBConnector;
