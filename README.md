# SurrealDB Node.js

```shell
npm i surrealdb
```
![https://img.shields.io/npm/v/surrealdb](https://img.shields.io/npm/v/surrealdb)
![https://img.shields.io/npm/dm/surrealdb](https://img.shields.io/npm/dm/surrealdb)
![https://img.shields.io/github/license/jareer12/surrealdb](https://img.shields.io/github/license/jareer12/surrealdb)
![https://img.shields.io/bundlephobia/min/surrealdb](https://img.shields.io/bundlephobia/min/surrealdb)

## Quick Start

**Basic start command**
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

**Initialize connection**
```ts
const Surreal = new SurrealDB('http://127.0.0.1:8000', {
  user: 'root',
  pass: 'root',
  database: 'test',
  namespace: 'test',
})
```


**NOTE:** [surrealdb](https://github.com/jareer12/surrealdb) is **NOT** affiliated with [SurrealDB](https://surrealdb.com).