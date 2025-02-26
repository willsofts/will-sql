"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnSQL = void 0;
const will_util_1 = require("@willsofts/will-util");
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBUtils_1 = require("./KnDBUtils");
const KnDBError_1 = require("./KnDBError");
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
    set(paramname, paramvalue, paramtype = KnDBAlias_1.KnDBTypes.STRING) {
        if (paramvalue === null) {
            this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
        }
        else if (paramvalue instanceof KnDBAlias_1.KnDBParamValue) {
            this.params.set(paramname, paramvalue);
        }
        else if (paramvalue instanceof Date) {
            this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
        }
        else {
            if (typeof paramvalue === "string") {
                this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "number") {
                this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
            }
            else if (typeof paramvalue === "boolean") {
                this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBAlias_1.KnDBTypes.BOOLEAN));
            }
            else if (typeof paramvalue === "bigint") {
                this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBAlias_1.KnDBTypes.BIGINT));
            }
            else if (typeof paramvalue === "undefined") {
                this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
            }
        }
        return this;
    }
    param(name) {
        let result = this.params.get(name);
        if (!result)
            throw new KnDBError_1.KnDBError("Parameter '" + name + "' not found", -10101);
        return result;
    }
    getExactlySql(alias = KnDBAlias_1.KnDBAlias.MYSQL) {
        let dbalias = KnDBUtils_1.KnDBUtils.parseDBAlias(alias);
        let odbc = dbalias == KnDBAlias_1.KnDBAlias.ODBC;
        let mysql = dbalias == KnDBAlias_1.KnDBAlias.MYSQL;
        let mssql = dbalias == KnDBAlias_1.KnDBAlias.MSSQL;
        let oracle = dbalias == KnDBAlias_1.KnDBAlias.ORACLE;
        let postgres = dbalias == KnDBAlias_1.KnDBAlias.POSTGRES;
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
            if (name.trim().length > 0) {
                results[name] = this.param(name);
            }
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
    async executeUpdate(db, ctx, params) {
        let span = this.createSpan(db, ctx);
        try {
            let [sqlopts, dbparam] = this.getSQLOptions(db);
            return db.executeUpdate(sqlopts, params || dbparam);
        }
        finally {
            if (span)
                span.finish();
        }
    }
    createSpan(db, ctx) {
        try {
            if (ctx) {
                let config = { ...db.config };
                if (config.password)
                    config.password = "unprint";
                if (config.url)
                    config.url = "unprint";
                return ctx.startSpan(db.constructor.name, { tags: { sql: this.sql, config: config } });
            }
        }
        catch (ex) { }
        return undefined;
    }
}
exports.KnSQL = KnSQL;
