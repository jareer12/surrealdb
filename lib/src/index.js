"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurrealQueryBuilder = void 0;
const sqb_1 = require("./sqb");
Object.defineProperty(exports, "SurrealQueryBuilder", { enumerable: true, get: function () { return sqb_1.SurrealQueryBuilder; } });
const node_fetch_1 = __importDefault(require("node-fetch"));
class SurrealDB {
    constructor(url, options) {
        this.url = url;
        this.options = options;
    }
    encodeBase64(string) {
        return Buffer.from(string).toString('base64');
    }
    CreateAuth() {
        return `Basic ${this.encodeBase64(`${this.options.user}:${this.options.pass}`)}`;
    }
    CreateHeaders() {
        return {
            'Content-Type': 'application/json',
            Authorization: this.CreateAuth(),
            Db: this.options.database,
            Ns: this.options.namespace,
        };
    }
    Use(namespace, database) {
        this.options.namespace = namespace;
        this.options.database = database;
        return true;
    }
    Query(query) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/sql`, {
                method: 'POST',
                headers: this.CreateHeaders(),
                body: query,
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    GetRecord(table, id) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/key/${table}/${id}`, {
                method: 'GET',
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    CreateRecord(table, id, data) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/key/${table}/${id}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    UpdateRecord(table, id, data) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/key/${table}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    GetTable(table) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/key/${table}`, {
                method: 'GET',
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
    ClearTable(table) {
        return new Promise((res, rej) => {
            (0, node_fetch_1.default)(`${this.url}/key/${table}`, {
                method: 'DELETE',
                headers: this.CreateHeaders(),
            })
                .then((res) => res.json())
                .then((data) => {
                res(data);
            })
                .catch((err) => {
                rej(err);
            });
        });
    }
}
exports.default = SurrealDB;
//# sourceMappingURL=index.js.map