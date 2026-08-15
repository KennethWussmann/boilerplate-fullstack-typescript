# Entities: Drizzle table + business object

An entity is two things that must stay in sync: a Drizzle table shaped for storage, and a business object class shaped for use in the application. Keeping them separate is what lets the database schema evolve without every service in the codebase changing with it.

The database is PostgreSQL via `drizzle-orm/postgres-js`, so tables use `pgTable`.

## Ask first

- **Domain**: which folder does this belong to? (`user`, `products`, `billing`)
- **Entity name**: singular, PascalCase in code (`User`, `Product`, `Token`)
- **Purpose**: one or two sentences, enough to judge whether it deserves its own domain
- **Fields**: names, types, nullability, defaults
- **Relations**: what does it point at, and is that a real foreign key or a loose reference?

## Implement

1. **Drizzle table** in `apps/server/src/database/schema.ts`

   Add a new table or extend an existing one, and export the inferred model type next to it — the business object takes that type as constructor input:

   ```typescript
   import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

   export const productsTable = pgTable('products', {
     id: uuid().primaryKey().defaultRandom(),
     name: text().notNull(),
     priceCents: integer().notNull(),
     createdAt: timestamp().notNull().defaultNow(),
   });

   export type ProductModel = typeof productsTable.$inferSelect;
   ```

2. **Business object** in `apps/server/src/{domain}/{entityName}.ts`

   A class that takes the database model in its constructor and can render itself back with `toModel()`. This is the object that travels through services and resolvers; the raw row should never leave the repository.

   ```typescript
   export class Product {
     public readonly id: string;
     public name: string;
     public price: Money;

     constructor(model: ProductModel) {
       this.id = model.id;
       this.name = model.name;
       this.price = Money.fromCents(model.priceCents);
     }

     public toModel = (): ProductModel => ({
       id: this.id,
       name: this.name,
       priceCents: this.price.cents,
       createdAt: this.createdAt,
     });
   }
   ```

   Put behaviour here too, not just data. A `Product` that knows how to apply a discount beats a bag of fields with that logic copy-pasted across three services.

3. **Export** it from `apps/server/src/{domain}/index.ts` via `export * from './product.js'`.

## Migrate

```bash
cd apps/server
pnpm db:generate
pnpm db:migrate
```

Read the generated SQL in `drizzle/` before applying it. Drizzle derives migrations from a schema diff, and a rename looks identical to a drop-plus-add — which loses data. If the SQL does not match the intent, fix the migration rather than the schema. `pnpm db:reset` rebuilds a local database from scratch when an experiment goes sideways.

## Report

Which fields exist and with what types, which relations were established, where the business object lives, and anything about the migration the user should double-check.
