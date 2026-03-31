"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBLibrary = void 0;
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBUtils_1 = require("./KnDBUtils");
const will_util_1 = require("@willsofts/will-util");
class KnDBLibrary {
    static getDBVersionQuery(config) {
        let dbdialect = KnDBUtils_1.KnDBUtils.parseDBDialect(config.dialect);
        if (KnDBAlias_1.KnDBDialect.MYSQL == dbdialect) {
            return "SELECT VERSION() as versioning";
        }
        else if (KnDBAlias_1.KnDBDialect.MSSQL == dbdialect) {
            return "SELECT @@VERSION AS versioning";
        }
        else if (KnDBAlias_1.KnDBDialect.POSTGRES == dbdialect) {
            return "SELECT version() as versioning";
        }
        else if (KnDBAlias_1.KnDBDialect.ORACLE == dbdialect) {
            return "SELECT BANNER AS versioning FROM V$VERSION";
        }
        else if (KnDBAlias_1.KnDBDialect.INFORMIX == dbdialect) {
            return "SELECT DBINFO('version', 'full') as versioning FROM systables where tabname = 'systables'";
        }
        else if (KnDBAlias_1.KnDBDialect.SQLITE == dbdialect) {
            return "SELECT SQLITE_VERSION() as versioning";
        }
        return "";
    }
    static async getDBVersion(db, config) {
        try {
            let sql = this.getDBVersionQuery(config);
            if (sql?.trim().length > 0) {
                let rs = await db.executeQuery(sql);
                if (rs?.rows?.length) {
                    let row = rs.rows[0];
                    let keys = Object.keys(row);
                    if (keys.length > 0) {
                        return row[keys[0]];
                    }
                }
            }
        }
        catch (ex) {
            console.error(ex);
        }
        return "";
    }
    static getQueryTimestamp(config) {
        let dbdialect = KnDBUtils_1.KnDBUtils.parseDBDialect(config.dialect);
        if (KnDBAlias_1.KnDBDialect.MYSQL == dbdialect || KnDBAlias_1.KnDBDialect.MSSQL == dbdialect || KnDBAlias_1.KnDBDialect.POSTGRES == dbdialect || KnDBAlias_1.KnDBDialect.SQLITE == dbdialect) {
            return "select current_timestamp as now";
        }
        else if (KnDBAlias_1.KnDBDialect.ORACLE == dbdialect) {
            return "select current_timestamp as now from dual";
        }
        else if (KnDBAlias_1.KnDBDialect.INFORMIX == dbdialect) {
            return "select current as now from systables";
        }
        else if (KnDBAlias_1.KnDBDialect.DB2 == dbdialect) {
            return "select current_timestamp as now from sysibm.sysdummy1";
        }
        return "";
    }
    static async getServerTimestamp(db, config) {
        try {
            let sql = this.getQueryTimestamp(config);
            if (sql?.trim().length > 0) {
                let rs = await db.executeQuery(sql);
                if (rs?.rows?.length) {
                    let row = rs.rows[0];
                    let keys = Object.keys(row);
                    if (keys.length > 0) {
                        return will_util_1.Utilities.parseDate(row[keys[0]]);
                    }
                }
            }
        }
        catch (ex) {
            console.error(ex);
        }
        return undefined;
    }
}
exports.KnDBLibrary = KnDBLibrary;
