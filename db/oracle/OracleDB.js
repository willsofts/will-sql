"use strict";
const OracleDBQuery_1 = require("./OracleDBQuery");
const OracleDBConnection_1 = require("./OracleDBConnection");
const DBConnect_1 = require("../DBConnect");
class OracleDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("ORACLE", "oracle", config);
        this.connector = new OracleDBConnection_1.OracleDBConnection(config);
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
        return await OracleDBQuery_1.OracleDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await OracleDBQuery_1.OracleDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        await this.initConnection();
        return await OracleDBQuery_1.OracleDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        return await OracleDBQuery_1.OracleDBQuery.commitWork(this.connection);
    }
    async rollbackWork() {
        await this.initConnection();
        return await OracleDBQuery_1.OracleDBQuery.rollbackWork(this.connection);
    }
    close() {
        if (this.connection) {
            OracleDBConnection_1.OracleDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        OracleDBConnection_1.OracleDBConnection.releasePool();
    }
}
module.exports = OracleDB;
