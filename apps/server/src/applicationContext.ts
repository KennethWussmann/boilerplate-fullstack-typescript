import type { Logger } from 'winston';
import type { Configuration } from './config/index.js';
import { HTTPServer } from './http/index.js';
export class ApplicationContext {
  public readonly configuration: Configuration;

  public httpServer: HTTPServer | null = null;

  constructor(
    configuration: Configuration,
    private readonly logger: Logger
  ) {
    this.configuration = configuration;
  }

  async initialize(): Promise<void> {
    this.logger.debug('Initializing application context');

    this.httpServer = new HTTPServer(this.configuration, this.logger.child({ name: 'httpServer' }));

    await this.httpServer.initialize();

    this.logger.info('Application context initialized successfully');
  }

  async shutdown(): Promise<void> {
    this.logger.debug('Shutting down application context');

    void this.httpServer?.shutdown();

    this.logger.info('Application context shutdown complete');
  }
}
