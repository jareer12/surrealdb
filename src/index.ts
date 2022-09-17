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
  result: any[]
}

export interface UnauthorizedResponse {
  code: number
  details: string
  description: string
  information: string
}

class SurrealDB {
  private url: string
  private options: SurrealConfigs

  constructor(url: string, options: SurrealConfigs) {
    this.url = url
    this.options = options
  }

  private encodeBase64 = (string: string) => {
    return Buffer.from(string).toString('base64')
  }

  private CreateAuth() {
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

  Query(query: string): Promise<SurrealResponse[] | UnauthorizedResponse> {
    return new Promise((res, rej) => {
      fetch(`${this.url}/sql`, {
        body: query,
        method: 'POST',
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

  GetTable(table: string): Promise<SurrealResponse[] | UnauthorizedResponse> {
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

  ClearTable(table: string): Promise<SurrealResponse[] | UnauthorizedResponse> {
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
