"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBConnect = void 0;
const KnDBUtils_1 = require("./KnDBUtils");
class KnDBConnect {
    constructor(alias, dialect, config) {
        this.alias = KnDBUtils_1.KnDBUtils.parseDBAlias(alias);
        this.dialect = dialect;
        this.config = config;
    }
    async init() {
        //do nothing
    }
    async getConnection() {
        throw new Error("Not implementation");
    }
    async doExecuteQuery(sql, params) {
        throw new Error("Not implementation");
    }
    async doExecuteUpdate(sql, params) {
        throw new Error("Not implementation");
    }
    async executeQuery(sql, params, ctx) {
        if (KnDBUtils_1.KnDBUtils.isSQLInterface(sql)) {
            return this.execQuery(sql, ctx);
        }
        return this.doExecuteQuery(sql, params);
    }
    async executeUpdate(sql, params, ctx) {
        if (KnDBUtils_1.KnDBUtils.isSQLInterface(sql)) {
            return this.execUpdate(sql);
        }
        return this.doExecuteUpdate(sql, params);
    }
    async execQuery(sql, ctx) {
        return sql.executeQuery(this, ctx);
    }
    async execUpdate(sql, ctx) {
        return sql.executeUpdate(this, ctx);
    }
    async beginWork() {
        throw new Error("Not implementation");
    }
    async commitWork() {
        throw new Error("Not implementation");
    }
    async rollbackWork() {
        throw new Error("Not implementation");
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
exports.KnDBConnect = KnDBConnect;
