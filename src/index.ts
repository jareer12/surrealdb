import { SurrealQueryBuilder } from './sqb'
import fetch from 'node-fetch'
import uniqid from 'uniqid'

export interface AnyObject {
  [key: string]: any
}

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
  result: SurrealResult[] | null
}

export interface UnauthorizedResponse {
  code: number
  details: string
  description: string
  information: string
}

export interface SurrealResult extends AnyObject {
  id: string
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
  DeleteTable: (table: string) => Promise<SurrealResponse[]>

  constructor(url: string, options: SurrealConfigs) {
    this.url = url
    this.options = options
    this.DeleteTable = this.ClearTable
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

  GetConfig() {
    return this.options
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

  DeleteRecord(table: string, id: string): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}/${id}`, {
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

  CreateRecord(
    table: string,
    id: string = uniqid(),
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

  CreateTable(
    table: string,
    data: { [key: string]: any },
  ): Promise<SurrealResponse[]> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/key/${table}`, {
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

export default SurrealDB
export { SurrealQueryBuilder }
