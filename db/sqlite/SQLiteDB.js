"use strict";
const SQLiteDBQuery_1 = require("./SQLiteDBQuery");
const SQLiteDBConnection_1 = require("./SQLiteDBConnection");
const DBConnect_1 = require("../DBConnect");
class SQLiteDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("SQLITE", "sqlite", config);
        this.connector = new SQLiteDBConnection_1.SQLiteDBConnection(config);
        this.connection = connection;
    }
    async initConnection() {
        if (this.connection == undefined || this.connection == null) {
            this.connection = this.connector.getConnection();
        }
    }
    async init() {
        this.initConnection();
    }
    reset() {
        this.connection = undefined;
    }
    async doExecuteQuery(sql, params) {
        await this.initConnection();
        return await SQLiteDBQuery_1.SQLiteDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await SQLiteDBQuery_1.SQLiteDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        await this.initConnection();
        return await SQLiteDBQuery_1.SQLiteDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        return await SQLiteDBQuery_1.SQLiteDBQuery.commitWork(this.connection);
    }
    async rollbackWork() {
        await this.initConnection();
        return await SQLiteDBQuery_1.SQLiteDBQuery.rollbackWork(this.connection);
    }
    close() {
        if (this.connection) {
            SQLiteDBConnection_1.SQLiteDBConnection.releaseConnection(this.connection);
            this.connector.remove();
        }
        this.reset();
    }
    end() {
        SQLiteDBConnection_1.SQLiteDBConnection.releasePool();
    }
}
module.exports = SQLiteDB;
