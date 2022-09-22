const stringify = require('stringify-object')
import { SurrealTypes, SurrealTypesRaw } from './index'

class SurrealQueryBuilder {
  query: string = ''
  constructor() {}

  private StringifyObject(value: any) {
    return stringify(value, {
      indent: '  ',
    })
  }

  private StringifyValue(value: any, type: SurrealTypes = 'default') {
    switch (type) {
      case 'string': {
        return `'${value}'`
      }
      case 'int': {
        return value
      }
      case 'object': {
        return this.StringifyObject(value)
      }
      case 'default': {
        return value
      }
      case 'array': {
        return `[${value.map((val: any) => {
          if (typeof val == 'object') {
            return `${this.StringifyObject(val)}`
          } else {
            return `${this.StringifyValue(
              val,
              typeof val == 'string' ? 'string' : 'int',
            )}`
          }
        })}]`
      }
    }
  }

  private StringifyType(key: any) {
    switch (key.type) {
      case 'object': {
        return ''
      }
      case 'array': {
        return ''
      }
      case 'default': {
        return ''
      }
      default: {
        return key.type != null ? `<${key.type}> ` : ''
      }
    }
  }

  private TypeToSurreal(type: any, isArray: boolean = false) {
    switch (type) {
      case 'number': {
        return 'int'
      }
      case 'string': {
        return 'string'
      }
      case 'object': {
        if (isArray == true) {
          return 'array'
        } else {
          return 'object'
        }
      }
      default: {
        return 'default'
      }
    }
  }

  DefineParam(key: string, value: SurrealTypesRaw) {
    this.query += `LET $${key} = ${this.StringifyValue(
      value,
      this.TypeToSurreal(typeof value),
    )};`

    return this
  }

  UseNamespace(namespace: string) {
    this.query = `${this.query}\nUSE NS ${namespace};`
    return this
  }

  UseDatabase(database: string) {
    this.query = `${this.query}\nUSE DB ${database};`
    return this
  }

  AppendCreate(
    name: string,
    keys: {
      key: string
      type?: SurrealTypes
      value: object | string | number | SurrealTypes[]
    }[],
  ) {
    this.query += `\nCREATE ${name} SET`

    for (let x = 0; x < keys.length; x++) {
      const key = keys[x]
      this.query += ` ${key.key} = ${this.StringifyType(
        key,
      )}${this.StringifyValue(key.value, key?.type)}${
        x < keys.length - 1 ? ',' : ''
      }`
    }

    this.query = `${this.query};`
    return this
  }

  WrapTransaction(type: 'COMMIT' | 'CANCLE') {
    this.query = `BEGIN TRANSACTION;\n${this.query}\n${type} TRANSACTION;`
    return this
  }

  Combine(query: string) {
    this.query = `${this.query}\n\n${query}`
    return this
  }

  Finalize() {
    return this.query
  }
}

export { SurrealQueryBuilder }
