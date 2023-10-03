"use strict";
const PgSQLDBQuery_1 = require("./PgSQLDBQuery");
const PgSQLDBConnection_1 = require("./PgSQLDBConnection");
const KnDBConnect_1 = require("../KnDBConnect");
class PgSQLDB extends KnDBConnect_1.KnDBConnect {
    constructor(config, connection) {
        super("POSTGRES", "postgres", config);
        this.connector = new PgSQLDBConnection_1.PgSQLDBConnection(config);
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
        return await PgSQLDBQuery_1.PgSQLDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await PgSQLDBQuery_1.PgSQLDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        await this.initConnection();
        return await PgSQLDBQuery_1.PgSQLDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        return await PgSQLDBQuery_1.PgSQLDBQuery.commitWork(this.connection);
    }
    async rollbackWork() {
        await this.initConnection();
        return await PgSQLDBQuery_1.PgSQLDBQuery.rollbackWork(this.connection);
    }
    close() {
        if (this.connection) {
            PgSQLDBConnection_1.PgSQLDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        PgSQLDBConnection_1.PgSQLDBConnection.releasePool();
    }
}
module.exports = PgSQLDB;
