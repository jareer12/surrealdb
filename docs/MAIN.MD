# Main

## Methods

- ClearTable
- CreateAuth
- CreateHeaders
- CreateRecord
- CreateTable
- DeleteRecord
- DeleteTable
- GetConfig
- GetRecord
- GetTable
- Query
- UpdateRecord
- Use


## Example Usage

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