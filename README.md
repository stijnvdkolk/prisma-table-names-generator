# Prisma Table Names Generator

The code for this prisma generator is based on the [prisma-kysely](https://github.com/valtyr/prisma-kysely) generator. Without it, this generator would not exist.

Want to use Prisma's raw SQL queries but don't want to write the table names by hand, leading to potential errors? This generator is for you!

## Installation

```bash
npm install prisma-table-names-generator
```

## Usage

1. Add the generator to your `schema.prisma` file:

```prisma
generator tableNames {
  provider = "prisma-table-names-generator"

  // Optional: specify the output directory
  output = "../db/generated"
  // Optional: specify the output file name
  fileName = "table.ts"
}
```

2. Run `prisma migrate dev` or `prisma generate` to generate the table names file and use it in your queries:

```typescript
import { PrismaClient } from '@prisma/client'
import { Table } from '../db/generated/table'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.$queryRaw(`SELECT * FROM ${Table.User}`)
  console.log(users)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```
