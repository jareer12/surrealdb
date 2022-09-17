"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class SurrealDB {
    url;
    options;
    constructor(url, options) {
        this.url = url;
        this.options = options;
    }
    encodeBase64 = (string) => {
        return Buffer.from(string).toString('base64');
    };
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
                body: query,
                method: 'POST',
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