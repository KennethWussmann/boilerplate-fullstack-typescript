import { createPubSub } from 'graphql-yoga';
import type { Logger } from 'winston';
import type { Configuration } from './config/index.js';
import { DatabaseService } from './database/index.js';
import type { AbstractFileSystem } from './file-system/abstractFileSystem.js';
import { LocalFileSystem } from './file-system/localFileSystem.js';
import { type GraphQLPubSub, HTTPServer } from './http/index.js';
import { LogStreamingService } from './log-streaming/index.js';

export class ApplicationContext {
  public readonly configuration: Configuration;
  public fileSystem: AbstractFileSystem = new LocalFileSystem();

  public readonly pubSub: GraphQLPubSub;
  public httpServer: HTTPServer | null = null;
  public databaseService: DatabaseService | null = null;
  public logStreamingService: LogStreamingService | null = null;

  constructor(
    configuration: Configuration,
    private readonly logger: Logger
  ) {
    this.configuration = configuration;
    this.pubSub = createPubSub();

    if (this.configuration.api.log_streaming_enabled) {
      this.logStreamingService = new LogStreamingService(this.pubSub);
      this.logger.add(this.logStreamingService.createTransport());
    }
  }

  async initialize(): Promise<void> {
    this.logger.debug('Initializing application context');

    this.httpServer = new HTTPServer(
      this.logger.child({ name: 'httpServer' }),
      this.configuration,
      this
    );
    this.databaseService = new DatabaseService(
      this.logger.child({ name: 'databaseService' }),
      this.configuration.database
    );

    await this.httpServer.initialize();
    await this.databaseService.initialize();

    this.logger.info('Application context initialized successfully');
  }

  async shutdown(): Promise<void> {
    this.logger.debug('Shutting down application context');

    void this.httpServer?.shutdown();
    void this.databaseService?.shutdown();

    this.logger.info('Application context shutdown complete');
  }
}
