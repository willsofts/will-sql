"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnDBFault = void 0;
class KnDBFault extends Error {
    constructor(message, code, state) {
        super(message);
        this.code = code;
        this.state = state;
        Object.setPrototypeOf(this, KnDBFault.prototype);
    }
}
exports.KnDBFault = KnDBFault;
