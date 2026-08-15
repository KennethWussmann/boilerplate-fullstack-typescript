# Services: business logic

Services hold the rules. They orchestrate repositories, enforce validations that span more than one record, and are the only layer a resolver is allowed to talk to. Thin resolvers mean the same logic works whether it is reached over GraphQL, REST, or a scheduled job.

## Ask first

- **Domain and name**: `apps/server/src/{domain}/{name}Service.ts`
- **What it does**: one or two sentences
- **Dependencies**: which repositories and other services? Which npm packages?
- **Lifecycle**: does it need to start and stop with the application (connections, timers, subscriptions), or is it stateless?
- **Operations**: what public methods should it expose?

The lifecycle question decides whether it belongs in `ApplicationContext`, so do not skip it.

## Implement

1. **Create the service** in `apps/server/src/{domain}/{name}Service.ts`.

   Dependencies come in through the constructor — that is what makes the service testable without booting the whole application. Methods are arrow-function properties, matching `DatabaseService` and the other services in the codebase:

   ```typescript
   export class ProductService {
     constructor(
       private readonly productRepository: ProductRepository,
       private readonly logger: Logger
     ) {}

     public publish = async (id: string): Promise<Product> => {
       const product = await this.productRepository.findById(id);
       if (!product) {
         throw new NotFoundError(`Product ${id} does not exist`);
       }
       product.publish();
       return this.productRepository.update(product);
     };
   }
   ```

   Field-level validation belongs in Zod at the edge; domain validation ("cannot publish a product without a price") belongs here.

2. **Wire it into `ApplicationContext`** when it holds state or a lifecycle. Construct it in `initialize()`, keep it as a private property, expose a getter, and release what it holds in `shutdown()`. Look at how `DatabaseService` and `RedisService` are wired and follow the same shape. Stateless services can simply be constructed where they are used.

3. **Export** from the domain's `index.ts`.

## Verify

```bash
pnpm check:fix
pnpm build
```

## Report

Files created and modified, what the service does, how to obtain it, which methods it exposes, and whether it participates in application startup and shutdown.
