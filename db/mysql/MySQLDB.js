"use strict";
const MySQLDBQuery_1 = require("./MySQLDBQuery");
const MySQLDBConnection_1 = require("./MySQLDBConnection");
const DBConnect_1 = require("../DBConnect");
class MySQLDB extends DBConnect_1.DBConnect {
    constructor(config, connection) {
        super("MYSQL", "mysql", config);
        this.connector = new MySQLDBConnection_1.MySQLDBConnection(config);
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
        return await MySQLDBQuery_1.MySQLDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await MySQLDBQuery_1.MySQLDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        await this.initConnection();
        return await MySQLDBQuery_1.MySQLDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        return await MySQLDBQuery_1.MySQLDBQuery.commitWork(this.connection);
    }
    async rollbackWork() {
        await this.initConnection();
        return await MySQLDBQuery_1.MySQLDBQuery.rollbackWork(this.connection);
    }
    close() {
        if (this.connection) {
            MySQLDBConnection_1.MySQLDBConnection.releaseConnection(this.connection);
        }
    }
    end() {
        MySQLDBConnection_1.MySQLDBConnection.releasePool();
    }
}
module.exports = MySQLDB;
