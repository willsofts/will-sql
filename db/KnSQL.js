"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnSQL = void 0;
const will_util_1 = require("@willsofts/will-util");
const KnDBAlias_1 = require("./KnDBAlias");
const KnDBUtils_1 = require("./KnDBUtils");
const KnDBError_1 = require("./KnDBError");
const UNPRINTED = process.env["UNPRINTED"] || "unprint";
class KnSQL {
    constructor(sql = "", options) {
        this.params = new Map();
        this.sql = sql;
        this.options = options;
    }
    clear() {
        this.sql = "";
        this.params.clear();
        return this;
    }
    clearParameter() {
        this.params.clear();
        return this;
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
        else if (typeof paramvalue === "string") {
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
        else if (paramvalue === undefined) {
            this.params.set(paramname, new KnDBAlias_1.KnDBParamValue(paramvalue, KnDBUtils_1.KnDBUtils.parseDBTypes(paramtype)));
        }
        return this;
    }
    param(name) {
        let result = this.params.get(name);
        if (!result)
            throw new KnDBError_1.KnDBError("Parameter '" + name + "' not found", -10101);
        return result;
    }
    getPlaceHolder(dba, element) {
        if (dba.mysql || dba.odbc) {
            return "?";
        }
        else if (dba.mssql) {
            return "@";
        }
        else if (dba.oracle) {
            return ":";
        }
        else if (dba.postgres) {
            return "$";
        }
        return element;
    }
    isParamToken(item) {
        return item !== " " && item !== ")" && item !== "," && item !== "\n";
    }
    getSqlItem(dba, item, index, paramnames) {
        let sqlstr = "";
        if (this.isParamToken(item)) {
            paramnames.push(item);
            if (dba.mssql || dba.oracle)
                sqlstr += item;
            if (dba.postgres)
                sqlstr += (++index); //$1,$2,$3,...
        }
        else {
            sqlstr += item;
        }
        return [sqlstr, index];
    }
    getExactlySql(alias = KnDBAlias_1.KnDBAlias.MYSQL) {
        let dbalias = KnDBUtils_1.KnDBUtils.parseDBAlias(alias);
        let dba = {
            odbc: dbalias == KnDBAlias_1.KnDBAlias.ODBC,
            mysql: dbalias == KnDBAlias_1.KnDBAlias.MYSQL,
            mssql: dbalias == KnDBAlias_1.KnDBAlias.MSSQL,
            oracle: dbalias == KnDBAlias_1.KnDBAlias.ORACLE,
            postgres: dbalias == KnDBAlias_1.KnDBAlias.POSTGRES
        };
        let sqlidx = 0;
        let sqlstr = "";
        let paramnames = [];
        let tok = new will_util_1.StringTokenizer(this.sql, "?), \n", true);
        let it = tok.iterator();
        while (it.hasNext()) {
            let element = it.next();
            if ("?" == element) {
                sqlstr += this.getPlaceHolder(dba, element);
                if (it.hasNext()) {
                    let item = it.next();
                    let [str, idx] = this.getSqlItem(dba, item, sqlidx, paramnames);
                    sqlstr += str;
                    sqlidx = idx;
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
    async executeQuery(db, ctx, params) {
        let span = this.createSpan(db, ctx);
        try {
            if (params) {
                let [sql] = this.getExactlySql(db.alias);
                return db.executeQuery({ sql: sql, options: this.options }, params);
            }
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
            if (params) {
                let [sql] = this.getExactlySql(db.alias);
                return db.executeUpdate({ sql: sql, options: this.options }, params);
            }
            let [sqlopts, dbparam] = this.getSQLOptions(db);
            return db.executeUpdate(sqlopts, dbparam);
        }
        finally {
            if (span)
                span.finish();
        }
    }
    createSpan(db, ctx) {
        if (ctx?.startSpan) {
            let config = { ...db.config };
            if (config.password)
                config.password = UNPRINTED;
            if (config.url)
                config.url = UNPRINTED;
            return ctx.startSpan(db.constructor.name, { tags: { sql: this.sql, config: config } });
        }
        return undefined;
    }
}
exports.KnSQL = KnSQL;
