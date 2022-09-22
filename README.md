# SurrealDB Node.js

```shell
npm i surrealdb
```
![https://img.shields.io/npm/v/surrealdb](https://img.shields.io/npm/v/surrealdb)
![https://img.shields.io/npm/dm/surrealdb](https://img.shields.io/npm/dm/surrealdb)
![https://img.shields.io/github/license/jareer12/surrealdb](https://img.shields.io/github/license/jareer12/surrealdb)
![https://img.shields.io/bundlephobia/min/surrealdb](https://img.shields.io/bundlephobia/min/surrealdb)

## Quick Start

```sh
surreal start --root user --pass user
```

**ES6**
```ts
import SurrealDB from 'surrealdb'
```

**Node.js**
```js
const SurrealDB = require("surrealdb")
```

```ts
const Surreal = new SurrealDB('http://127.0.0.1:8000', {
  user: 'root',
  pass: 'root',
  database: 'test',
  namespace: 'test',
})
```

## Guide


```ts
// Async
const Async = await Surreal.Query(`CREATE company:surrealdb SET name = 'SurrealDB', cofounders = [person:tobie, person:jaime];`)

// Promise
Surreal.Query(
  `CREATE company:surrealdb SET name = 'SurrealDB', cofounders = [person:tobie, person:jaime];`,
)
  .then((data) => {
    console.log(data)
  })
  .catch((err) => {
    console.log(err)
  })
```

## Surreal Query Builder

```ts
import { SurrealQueryBuilder } from 'surrealdb'

  const SQB = new SurrealQueryBuilder()
    .UseDatabase('test')
    .UseNamespace('test')
    .DefineParam('username', 'John Doe')
    .AppendCreate('user', [
      {
        key: 'name',
        type: 'default',
        value: '$username',
      },
      {
        key: 'age',
        type: 'int',
        value: 18,
      },
      {
        key: 'friends',
        type: 'array',
        value: [
          {
            name: 'James',
            age: 17,
          },
          {
            name: 'Bob',
            age: 18,
          },
        ],
      },
    ])
    .WrapTransaction('COMMIT')
    .Combine(`# Your custom query\nSELECT * FROM user;`)
    .Finalize()

console.log(SQB.query) // OR SQB.Finalize()
```

```sql
BEGIN TRANSACTION;
LET $username = 'John Doe';
CREATE user SET name = $username, age = <int> 18, friends = [
  {
    name: 'James',
    age: 17
  },
  {
    name: 'Bob',
    age: 18
  }
];
COMMIT TRANSACTION;
```

**NOTE:** [surrealdb](https://github.com/jareer12/surrealdb) is **NOT** affiliated with [SurrealDB](https://surrealdb.com).