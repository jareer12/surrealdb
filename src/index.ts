const stringify = require('stringify-object')
import fetch from 'node-fetch'

export interface SurrealConfigs {
  user: string
  pass: string
  namespace: string
  database: string
}

export interface SurrealResponse {
  time: string
  status: 'ERR' | 'OK'
  detail: string
  result: any[] | null
}

export interface UnauthorizedResponse {
  code: number
  details: string
  description: string
  information: string
}

export interface AnyObject {
  [key: string]: any
}

export type SurrealTypesRaw = string | number | object | any[]

export type SurrealTypes =
  | 'string'
  | 'int'
  | 'float'
  | 'object'
  | 'array'
  | 'default'

class SurrealDB {
  private url: string
  private options: SurrealConfigs

  constructor(url: string, options: SurrealConfigs) {
    this.url = url
    this.options = options
  }

  private encodeBase64(string: string): string {
    return Buffer.from(string).toString('base64')
  }

  private CreateAuth(): string {
    return `Basic ${this.encodeBase64(
      `${this.options.user}:${this.options.pass}`,
    )}`
  }

  private CreateHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.CreateAuth(),
      Db: this.options.database,
      Ns: this.options.namespace,
    }
  }

  Use(namespace: string, database: string) {
    this.options.namespace = namespace
    this.options.database = database
    return true
  }

  Query(query: string): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/sql`, {
        method: 'POST',
        headers: this.CreateHeaders(),
        body: query,
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  GetRecord(table: string, id: string): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}/${id}`, {
        method: 'GET',
        headers: this.CreateHeaders(),
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  CreateRecord(
    table: string,
    id: string,
    data: { [key: string]: any },
  ): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}/${id}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: this.CreateHeaders(),
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  UpdateRecord(
    table: string,
    id: string,
    data: { [key: string]: any },
  ): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: this.CreateHeaders(),
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  GetTable(table: string): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}`, {
        method: 'GET',
        headers: this.CreateHeaders(),
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }

  ClearTable(table: string): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}`, {
        method: 'DELETE',
        headers: this.CreateHeaders(),
      })
        .then((res) => res.json())
        .then((data: any) => {
          res(data)
        })
        .catch((err) => {
          rej(err)
        })
    })
  }
}

class SurrealQueryBuilder {
  query: string = ''
  constructor() {}

  private StringifyObject(value: any) {
    return stringify(value, {
      indent: '  ',
    })
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

  Finalize() {
    return this.query
  }
}

export default SurrealDB
export { SurrealQueryBuilder }
