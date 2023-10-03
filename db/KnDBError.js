"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBError = void 0;
class KnDBError extends Error {
    constructor(message, code, state) {
        super(message);
        this.code = code;
        this.state = state;
        Object.setPrototypeOf(this, KnDBError.prototype);
    }
}
exports.KnDBError = KnDBError;
