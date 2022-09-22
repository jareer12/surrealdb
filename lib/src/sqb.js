"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurrealQueryBuilder = void 0;
const stringify = require('stringify-object');
class SurrealQueryBuilder {
    constructor() {
        this.query = '';
    }
    StringifyObject(value) {
        return stringify(value, {
            indent: '  ',
        });
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
    UseNamespace(namespace) {
        this.query = `${this.query}\nUSE NS ${namespace};`;
        return this;
    }
    UseDatabase(database) {
        this.query = `${this.query}\nUSE DB ${database};`;
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
//# sourceMappingURL=sqb.js.map