"use strict";
const MsSQLDBQuery_1 = require("./MsSQLDBQuery");
const MsSQLDBConnection_1 = require("./MsSQLDBConnection");
const KnDBConnect_1 = require("../KnDBConnect");
class MsSQLDB extends KnDBConnect_1.KnDBConnect {
    constructor(config, connection) {
        super("MSSQL", "mssql", config);
        this.connector = new MsSQLDBConnection_1.MsSQLDBConnection(config);
        this.connection = connection;
    }
    async initConnection() {
        if (!this.connection) {
            this.connection = await this.connector.getConnection(this.transaction);
        }
    }
    async init() {
        await this.initConnection();
    }
    async getConnection() {
        await this.initConnection();
        return this.connection;
    }
    reset() {
        this.connection = undefined;
        this.transaction = undefined;
    }
    async doExecuteQuery(sql, params) {
        await this.initConnection();
        return await MsSQLDBQuery_1.MsSQLDBQuery.executeQuery(this.connection, sql, params);
    }
    async doExecuteUpdate(sql, params) {
        await this.initConnection();
        return await MsSQLDBQuery_1.MsSQLDBQuery.executeUpdate(this.connection, sql, params);
    }
    async beginWork() {
        this.reset();
        this.transaction = await this.connector.getTransaction();
        await this.initConnection();
        return await MsSQLDBQuery_1.MsSQLDBQuery.beginWork(this.connection);
    }
    async commitWork() {
        await this.initConnection();
        try {
            return await MsSQLDBQuery_1.MsSQLDBQuery.commitWork(this.connection);
        }
        finally {
            this.reset();
        }
    }
    async rollbackWork() {
        await this.initConnection();
        try {
            return await MsSQLDBQuery_1.MsSQLDBQuery.rollbackWork(this.connection);
        }
        finally {
            this.reset();
        }
    }
    close() {
        if (this.connection) {
            MsSQLDBConnection_1.MsSQLDBConnection.releaseConnection();
        }
    }
    end() {
        MsSQLDBConnection_1.MsSQLDBConnection.releasePool();
    }
}
module.exports = MsSQLDB;
