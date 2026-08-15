# Repositories: data access

A repository is the only place that knows Drizzle exists. Everything above it deals in business objects, which is what keeps the storage layer replaceable and the services testable.

## Ask first

- **Domain**: which folder? (`user`, `products`)
- **Entity**: which business object does it read and write?
- **Extra operations**: anything beyond the standard set below?

## Implement

Create `apps/server/src/{domain}/{entityName}Repository.ts`.

### The standard surface

Every repository provides these, named for what they do rather than what they operate on:

- `findById(id)`
- `findAll({ limit, offset, sortBy, sortDirection })`
- `create(entity)`
- `update(entity)`
- `upsert(entity)`
- `delete(entity)`
- `deleteById(id)`

Repeating the entity name inside its own repository (`findProductById` on `ProductRepository`) is noise — the type already says it. The names should read as plain English at the call site: `products.findById(id)`.

`findAll` takes limit/offset pagination and resolves its sort field dynamically against the table definition instead of switching over hard-coded column names. Hard-coded sort switches rot the moment somebody adds a field, turning a schema change into a repository change for no reason.

### Input and output

Repositories take business objects in and hand business objects out. The mapping lives inside the business object (`new Product(row)` / `product.toModel()`), never inline in the repository — otherwise the same mapping is duplicated across five methods and drifts.

### Database access

Drizzle comes from the `DatabaseService` that `ApplicationContext` owns. `getDatabase()` is async because the connection is established during startup:

```typescript
import { asc, desc, eq } from 'drizzle-orm';
import { productsTable } from '../database/schema.js';
import type { DatabaseService } from '../database/index.js';
import { Product } from './product.js';

export class ProductRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public findById = async (id: string): Promise<Product | undefined> => {
    const db = await this.databaseService.getDatabase();
    const [row] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    return row ? new Product(row) : undefined;
  };
}
```

Export it from the domain's `index.ts`.

## Report

Which methods exist, what they return, how to obtain the repository, and which entity it is bound to.
