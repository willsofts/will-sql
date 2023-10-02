"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBError = void 0;
class DBError extends Error {
    constructor(message, code, state) {
        super(message);
        this.code = code;
        this.state = state;
        Object.setPrototypeOf(this, DBError.prototype);
    }
}
exports.DBError = DBError;
