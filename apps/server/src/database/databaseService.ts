import { drizzle } from 'drizzle-orm/libsql';
import type { Logger } from 'winston';
import type { Configuration } from '../config/index.js';
import { DatabaseUninitializedError } from '../error/error.js';

export class DatabaseService {
  private database: ReturnType<typeof drizzle> | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly config: Configuration['database']
  ) {}

  public initialize = async () => {
    if (!this.config.enabled) {
      this.logger.info('The database is disabled');
      return;
    }
    this.database = drizzle(this.config.connection_url);
    this.logger.info('Connected to database');
  };

  public shutdown = async () => {};

  public getDatabase = async () => {
    if (!this.config.enabled) {
      throw new DatabaseUninitializedError('Database is disabled');
    }
    if (!this.database) {
      throw new DatabaseUninitializedError('Database is not initialized yet');
    }
    return this.database;
  };
}
