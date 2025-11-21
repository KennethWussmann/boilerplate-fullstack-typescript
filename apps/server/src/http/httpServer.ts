import type { Server } from 'node:http';
import cors from 'cors';
import express, { type Application } from 'express';
import type { Logger } from 'winston';
import type { ApplicationContext } from '@/applicationContext.js';
import { toError } from '@/utils/error.js';
import type { Configuration } from '../config/index.js';
import { HealthModule } from './routers/health/healthModule.js';
import { GraphQLRouter, HealthBroadcastService, HealthRouter } from './routers/index.js';

export class HTTPServer {
  private app: Application;
  private server: Server | null = null;
  private healthBroadcastService: HealthBroadcastService;
  constructor(
    private readonly config: Configuration,
    private readonly logger: Logger,
    private readonly applicationContext: ApplicationContext
  ) {
    this.app = express();
    this.healthBroadcastService = new HealthBroadcastService(applicationContext.pubSub);
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    if (this.config.api.cors_enabled !== false) {
      this.app.use(cors());
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupRouters(server: Server) {
    const basePath = this.config.api.base_path || '/';
    await Promise.all(
      [
        new GraphQLRouter(
          this.logger.child({ name: 'graphql' }),
          server,
          {
            applicationContext: this.applicationContext,
            logger: this.logger.child({ name: 'graphql-resolver' }),
            pubSub: this.applicationContext.pubSub,
          },
          [HealthModule]
        ),
        new HealthRouter(this.healthBroadcastService),
      ].map(async (router) => {
        await router.initialize();
        this.app.use(basePath, router.router);
      })
    );
  }

  public initialize = async (): Promise<void> => {
    await this.healthBroadcastService.initialize();
    return new Promise((resolve, reject) => {
      if (!this.config.api.enabled) {
        this.logger.debug('API is disabled, skipping HTTP server initialization');
        resolve();
        return;
      }

      const port = this.config.api.port;

      if (!port) {
        reject(new Error('API is enabled, but no port is configured'));
        return;
      }

      this.server = this.app.listen(port, async () => {
        const basePath = this.config.api.base_path || '/';
        if (this.server) {
          try {
            await this.setupRouters(this.server);
            this.logger.debug(`Loaded routers`);
          } catch (e: unknown) {
            this.logger.error('Failed to load routers', { error: toError(e) });
            void this.shutdown();
            resolve();
            return;
          }
        }
        resolve();
        this.logger.info(`HTTP server started on port ${port} with base path ${basePath}`);
      });

      this.server.on('error', (error) => {
        this.logger.error('Failed to start HTTP server:', error);
        reject(error);
      });
    });
  };

  public shutdown = async (): Promise<void> => {
    await this.healthBroadcastService.shutdown();
    return new Promise((resolve) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close(() => {
        this.logger.info('HTTP server stopped');
        this.server = null;
        resolve();
      });
    });
  };

  public getApp(): express.Application {
    return this.app;
  }
}
