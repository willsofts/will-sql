"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBLibrary = void 0;
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBUtils_1 = require("./KnDBUtils");
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
            if (sql.trim().length > 0) {
                let rs = await db.executeQuery(sql);
                if (rs && rs.rows.length > 0) {
                    let row = rs.rows[0];
                    let keys = Object.keys(row);
                    if (keys.length > 0) {
                        return Promise.resolve(row[keys[0]]);
                    }
                }
            }
        }
        catch (ex) {
            console.error(ex);
        }
        return Promise.resolve("");
    }
}
exports.KnDBLibrary = KnDBLibrary;
