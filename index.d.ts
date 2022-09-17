declare module 'surrealdb'

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
