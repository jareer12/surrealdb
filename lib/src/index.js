"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurrealQueryBuilder = void 0;
const stringify = require('stringify-object');
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
class SurrealQueryBuilder {
    constructor() {
        this.query = '';
    }
    StringifyObject(value) {
        return stringify(value, {
            indent: '  ',
        });
        // let toStr = ''
        // const keys = Object.keys(value)
        // for (let i = 0; i < keys.length; i++) {
        //   const key = keys[i]
        //   if (value.hasOwnProperty(key)) {
        //     toStr +=
        //       `${i > 0 === true ? ' ' : ''}${key}: ${this.StringifyValue(
        //         value[key],
        //         typeof value[key] == 'string' ? 'string' : 'default',
        //       )}` + `${i < keys.length - 1 ? ',' : ''}`
        //   }
        // }
        // return `{ ${toStr} }`
    }
    StringifyValue(value, type = 'default') {
        switch (type) {
            case 'string': {
                return `'${value}'`;
            }
            case 'int': {
                return value;
            }
            case 'object': {
                return this.StringifyObject(value);
            }
            case 'default': {
                return value;
            }
            case 'array': {
                return `[${value.map((val) => {
                    if (typeof val == 'object') {
                        return `${this.StringifyObject(val)}`;
                    }
                    else {
                        return `${this.StringifyValue(val, typeof val == 'string' ? 'string' : 'int')}`;
                    }
                })}]`;
            }
        }
    }
    StringifyType(key) {
        switch (key.type) {
            case 'object': {
                return '';
            }
            case 'array': {
                return '';
            }
            case 'default': {
                return '';
            }
            default: {
                return key.type != null ? `<${key.type}> ` : '';
            }
        }
    }
    TypeToSurreal(type, isArray = false) {
        switch (type) {
            case 'number': {
                return 'int';
            }
            case 'string': {
                return 'string';
            }
            case 'object': {
                if (isArray == true) {
                    return 'array';
                }
                else {
                    return 'object';
                }
            }
            default: {
                return 'default';
            }
        }
    }
    DefineParam(key, value) {
        this.query += `LET $${key} = ${this.StringifyValue(value, this.TypeToSurreal(typeof value))};`;
        return this;
    }
    AppendCreate(name, keys) {
        this.query += `\nCREATE ${name} SET`;
        for (let x = 0; x < keys.length; x++) {
            const key = keys[x];
            this.query += ` ${key.key} = ${this.StringifyType(key)}${this.StringifyValue(key.value, key === null || key === void 0 ? void 0 : key.type)}${x < keys.length - 1 ? ',' : ''}`;
        }
        this.query = `${this.query};`;
        return this;
    }
    WrapTransaction(type) {
        this.query = `BEGIN TRANSACTION;\n${this.query}\n${type} TRANSACTION;`;
        return this;
    }
    Finalize() {
        return this.query;
    }
}
exports.SurrealQueryBuilder = SurrealQueryBuilder;
exports.default = SurrealDB;
//# sourceMappingURL=index.js.map