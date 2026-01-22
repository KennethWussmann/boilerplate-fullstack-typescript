export class ApplicationError extends Error {
  constructor(public override readonly message: string) {
    super(message);
  }
}

export class ApplicationUninitializedError extends ApplicationError {}
export class DatabaseUninitializedError extends ApplicationError {}
export class RedisUninitializedError extends ApplicationError {}
