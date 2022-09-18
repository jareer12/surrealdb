# SurrealDB Node.js

```shell
npm i surrealdb
```

## Quick Start

```sh
surreal start --root user --pass user
```

```ts
import SurrealDB from 'surrealdb'

const Surreal = new SurrealDB('http://127.0.0.1:8000', {
  user: 'root',
  pass: 'root',
  database: 'test',
  namespace: 'test',
})
```

## Guide

```ts
const Output = await Surreal.Query(
  `CREATE company:surrealdb SET name = 'SurrealDB', cofounders = [person:tobie, person:jaime];`,
)

console.log(Output)
```