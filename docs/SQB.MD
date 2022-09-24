# Surreal Query Builder


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
  

const RQuery = await Surreal.Query(SQB.Finalize()) // Run the query 

console.log(SQB.query) // OR SQB.Finalize()
console.log(RQuery)
```

**Generated Query**
```sql
BEGIN TRANSACTION;
USE DB test;
USE NS test;LET $username = 'John Doe';
CREATE user SET name = $username, age = <int> 18, friends = [{
  name: 'James',
  age: 17
},{
  name: 'Bob',
  age: 18
}];
COMMIT TRANSACTION;

# Your custom query
SELECT * FROM user;
```