"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDBConnector = exports.DBConnections = void 0;
const will_util_1 = __importDefault(require("@willsofts/will-util"));
const will_util_2 = require("@willsofts/will-util");
const DBVariable_1 = require("./DBVariable");
const DBError_1 = require("./DBError");
const DBConfig_1 = require("./DBConfig");
class DBConnections {
    static getDBConnector(configure = { schema: DBVariable_1.DB_SCHEMA, alias: DBVariable_1.DB_ALIAS, dialect: DBVariable_1.DB_DIALECT, url: DBVariable_1.DB_URL, user: DBVariable_1.DB_USER, password: DBVariable_1.DB_PASSWORD }) {
        //console.log("config",config);
        if (typeof configure === "string") {
            if (will_util_1.default.has(configure)) {
                let section = will_util_1.default.get(configure);
                DBConfig_1.dbconfig.schema = configure;
                DBConfig_1.dbconfig.alias = section["alias"];
                DBConfig_1.dbconfig.dialect = section["dialect"];
                DBConfig_1.dbconfig.url = section["url"];
                DBConfig_1.dbconfig.user = section["user"];
                DBConfig_1.dbconfig.password = section["password"];
                DBConfig_1.dbconfig.host = section["host"];
                DBConfig_1.dbconfig.port = section["port"];
                DBConfig_1.dbconfig.database = section["database"];
                DBConfig_1.dbconfig.options = section["options"];
            }
            else {
                throw new DBError_1.DBError("Database configuration '" + configure + "' not found", -10001);
            }
        }
        else {
            DBConfig_1.dbconfig.schema = configure.schema;
            DBConfig_1.dbconfig.alias = configure.alias;
            DBConfig_1.dbconfig.dialect = configure.dialect;
            DBConfig_1.dbconfig.url = configure.url;
            DBConfig_1.dbconfig.user = configure.user;
            DBConfig_1.dbconfig.password = configure.password;
            DBConfig_1.dbconfig.options = configure.options;
        }
        //console.log("dbconfig",dbconfig);
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "MYSQL")) {
            const MySQLDB = require("./mysql/MySQLDB");
            return new MySQLDB({ ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "MYSQL2")) {
            const MySQLDB = require("./mysql2/MySQLDB");
            return new MySQLDB({ ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "ODBC")) {
            const OdbcDB = require("./odbc/OdbcDB");
            return new OdbcDB(DBConfig_1.dbconfig.dialect, { ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "MSSQL")) {
            const MsSQLDB = require("./mssql/MsSQLDB");
            return new MsSQLDB({ ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "ORACLE")) {
            const OracleDB = require("./oracle/OracleDB");
            return new OracleDB({ ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "POSTGRES")) {
            const PgSQLDB = require("./postgres/PgSQLDB");
            return new PgSQLDB({ ...DBConfig_1.dbconfig });
        }
        if (will_util_2.Utilities.equalsIgnoreCase(DBConfig_1.dbconfig.alias, "SQLITE")) {
            const SQLiteDB = require("./sqlite/SQLiteDB");
            return new SQLiteDB({ ...DBConfig_1.dbconfig });
        }
        throw new DBError_1.DBError("Database alias '" + DBConfig_1.dbconfig.alias + "' not supported", -10002);
    }
}
exports.DBConnections = DBConnections;
function getDBConnector(section) {
    return DBConnections.getDBConnector(section);
}
exports.getDBConnector = getDBConnector;
