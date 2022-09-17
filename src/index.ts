import fetch from 'node-fetch'
import { SurrealResponse, SurrealConfigs, UnauthorizedResponse } from '../index'

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

  private decodeBase64 = (string: string) => {
    return Buffer.from(string, 'base64').toString('ascii')
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
}

export default SurrealDB
