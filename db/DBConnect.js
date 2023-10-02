"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnect = void 0;
const DBUtils_1 = require("./DBUtils");
class DBConnect {
    constructor(alias, dialect, config) {
        this.alias = DBUtils_1.DBUtils.parseDBAlias(alias);
        this.dialect = dialect;
        this.config = config;
    }
    async init() {
        //do nothing
    }
    async doExecuteQuery(sql, params) {
        return Promise.reject(null);
    }
    async doExecuteUpdate(sql, params) {
        return Promise.reject(null);
    }
    async executeQuery(sql, params) {
        if (DBUtils_1.DBUtils.isSQLInterface(sql)) {
            return this.execQuery(sql);
        }
        return this.doExecuteQuery(sql, params);
    }
    async executeUpdate(sql, params) {
        if (DBUtils_1.DBUtils.isSQLInterface(sql)) {
            return this.execUpdate(sql);
        }
        return this.doExecuteUpdate(sql, params);
    }
    async execQuery(sql) {
        return sql.executeQuery(this);
    }
    async execUpdate(sql) {
        return sql.executeUpdate(this);
    }
    async beginWork() {
        return Promise.reject();
    }
    async commitWork() {
        return Promise.reject();
    }
    async rollbackWork() {
        return Promise.reject();
    }
    reset() {
        //do nothing
    }
    /* close connection */
    close() {
        //do nothing
    }
    /* end pool */
    end() {
        //do nothing
    }
}
exports.DBConnect = DBConnect;
