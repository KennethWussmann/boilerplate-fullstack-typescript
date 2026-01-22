import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { Logger } from 'winston';
import type { Configuration } from '../config/index.js';
import { DatabaseUninitializedError } from '../error/error.js';

export class DatabaseService {
  private database: ReturnType<typeof drizzle> | null = null;
  private client: ReturnType<typeof postgres> | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly config: Configuration['database']
  ) {}

  public initialize = async () => {
    if (!this.config.enabled) {
      this.logger.info('The database is disabled');
      return;
    }
    this.client = postgres(this.config.connection_url);
    this.database = drizzle(this.client);
    this.logger.info('Connected to database');
  };

  public shutdown = async () => {
    if (this.client) {
      await this.client.end();
    }
  };

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
