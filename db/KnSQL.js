"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnSQL = void 0;
const will_util_1 = require("@willsofts/will-util");
const DBAlias_1 = require("./DBAlias");
const DBUtils_1 = require("./DBUtils");
const DBError_1 = require("./DBError");
class KnSQL {
    constructor(sql = "", options) {
        this.params = new Map();
        this.sql = sql;
        this.options = options;
    }
    clear() {
        this.sql = "";
        this.params.clear();
    }
    clearParameter() {
        this.params.clear();
    }
    append(sql) {
        this.sql += sql;
        return this;
    }
    set(paramname, paramvalue, paramtype = DBAlias_1.DBTypes.STRING) {
        if (paramvalue === null) {
            this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
        }
        else if (paramvalue instanceof DBAlias_1.DBParamValue) {
            this.params.set(paramname, paramvalue);
        }
        else if (paramvalue instanceof Date) {
            this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
        }
        else {
            if (typeof paramvalue === "string") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "number") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "boolean") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBAlias_1.DBTypes.BOOLEAN));
            }
            else if (typeof paramvalue === "bigint") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBAlias_1.DBTypes.BIGINT));
            }
            else if (typeof paramvalue === "undefined") {
                this.params.set(paramname, new DBAlias_1.DBParamValue(paramvalue, DBUtils_1.DBUtils.parseDBTypes(paramtype)));
            }
        }
        return this;
    }
    param(name) {
        let result = this.params.get(name);
        if (!result)
            throw new DBError_1.DBError("Parameter '" + name + "' not found", -10101);
        return result;
    }
    getExactlySql(alias = DBAlias_1.DBAlias.MYSQL) {
        let dbalias = DBUtils_1.DBUtils.parseDBAlias(alias);
        let odbc = dbalias == DBAlias_1.DBAlias.ODBC;
        let mysql = dbalias == DBAlias_1.DBAlias.MYSQL;
        let mssql = dbalias == DBAlias_1.DBAlias.MSSQL;
        let oracle = dbalias == DBAlias_1.DBAlias.ORACLE;
        let postgres = dbalias == DBAlias_1.DBAlias.POSTGRES;
        let sqlidx = 0;
        let sqlstr = "";
        let paramnames = [];
        let tok = new will_util_1.StringTokenizer(this.sql, "?), \n", true);
        let it = tok.iterator();
        while (it.hasNext()) {
            let element = it.next();
            if ("?" == element) {
                sqlstr += (mysql || odbc ? "?" : (mssql ? "@" : (oracle ? ":" : (postgres ? "$" : element))));
                if (it.hasNext()) {
                    let item = it.next();
                    if (!(" " == item) && !(")" == item) && !("," == item) && !("\n" == item)) {
                        paramnames.push(item);
                        if (mssql || oracle)
                            sqlstr += item;
                        if (postgres)
                            sqlstr += (++sqlidx); //$1,$2,$3,...
                    }
                    else {
                        sqlstr += item;
                    }
                }
            }
            else {
                sqlstr += element;
            }
        }
        return [sqlstr, paramnames];
    }
    parameters(names) {
        let results = [];
        for (let name of names) {
            let pr = this.param(name);
            if (pr) {
                results.push(pr.value);
            }
            else {
                results.push(undefined);
            }
        }
        ;
        return results;
    }
    getDBParam(names) {
        let results = {};
        for (let name of names) {
            results[name] = this.param(name);
        }
        return results;
    }
    getSQLOptions(db) {
        let [sql, paramnames] = this.getExactlySql(db.alias);
        let dbparam = this.getDBParam(paramnames);
        return [{ sql: sql, options: this.options }, dbparam];
    }
    async executeQuery(db, ctx) {
        let span = this.createSpan(db, ctx);
        try {
            let [sqlopts, dbparam] = this.getSQLOptions(db);
            return db.executeQuery(sqlopts, dbparam);
        }
        finally {
            if (span)
                span.finish();
        }
    }
    async executeUpdate(db, ctx) {
        let span = this.createSpan(db, ctx);
        try {
            let [sqlopts, dbparam] = this.getSQLOptions(db);
            return db.executeUpdate(sqlopts, dbparam);
        }
        finally {
            if (span)
                span.finish();
        }
    }
    createSpan(db, ctx) {
        try {
            if (ctx) {
                return ctx.startSpan(db.constructor.name, { tags: { sql: this.sql, config: db.config } });
            }
        }
        catch (ex) { }
        return undefined;
    }
}
exports.KnSQL = KnSQL;
