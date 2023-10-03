"use strict";
const OdbcDBQuery_1 = require("./OdbcDBQuery");
const OdbcDBConnection_1 = require("./OdbcDBConnection");
const KnDBConnect_1 = require("../KnDBConnect");
class OdbcDB extends KnDBConnect_1.KnDBConnect {
    constructor(dialect, config, connection) {
        super("ODBC", dialect, config);
        this.connector = new OdbcDBConnection_1.OdbcDBConnection(config);
        this.connection = connection;
    }
    async initConnection() {
        if (this.connection == undefined || this.connection == null) {
            this.connection = await this.connector.getConnection();
        }
    }
    async init() {
        await this.initConnection();
    }
    reset() {
        this.connection = undefined;
    }
    async doExecuteQuery(sql, params) {
        await this.initConnection();
        return await OdbcDBQuery_1.OdbcDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await OdbcDBQuery_1.OdbcDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        await this.initConnection();
        return await OdbcDBQuery_1.OdbcDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        return await OdbcDBQuery_1.OdbcDBQuery.commitWork(this.connection);
    }
    async rollbackWork() {
        await this.initConnection();
        return await OdbcDBQuery_1.OdbcDBQuery.rollbackWork(this.connection);
    }
    close() {
        if (this.connection) {
            OdbcDBConnection_1.OdbcDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        OdbcDBConnection_1.OdbcDBConnection.releasePool();
    }
}
module.exports = OdbcDB;
