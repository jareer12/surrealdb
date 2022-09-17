# SurrealDB Node.js

```shell
npm i surreal.js2
```

```ts
import SurrealDB from 'surrealdb.js2'

const Surreal = new SurrealDB('http://127.0.0.1:8000', {
  user: 'root',
  pass: 'root',
  database: 'test',
  namespace: 'test',
})
```

```ts
async function main() {
  const Output = await Surreal.Query(
    `CREATE company:surrealdb SET name = 'SurrealDB', cofounders = [person:tobie, person:jaime];`,
  )

  console.log(Output)
}

main()
```