"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PASSWORD = exports.DB_USER = exports.DB_DIALECT = exports.DB_ALIAS = exports.DB_URL = exports.DB_SCHEMA = void 0;
const will_util_1 = __importDefault(require("@willsofts/will-util"));
exports.DB_SCHEMA = will_util_1.default.env("DB_SCHEMA", "TESTDB");
exports.DB_URL = will_util_1.default.env("DB_URL", "");
exports.DB_ALIAS = will_util_1.default.env("DB_ALIAS", "mysql");
exports.DB_DIALECT = will_util_1.default.env("DB_DIALECT", "mysql");
exports.DB_USER = will_util_1.default.env("DB_USER", "");
exports.DB_PASSWORD = will_util_1.default.env("DB_PASSWORD", "");
