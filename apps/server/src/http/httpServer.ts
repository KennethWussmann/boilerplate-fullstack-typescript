import type { Server } from 'node:http';
import { join } from 'node:path';
import cors from 'cors';
import express, { type Application } from 'express';
import type { Logger } from 'winston';
import type { ApplicationContext } from '../applicationContext.js';
import type { Configuration } from '../config/index.js';
import { toError } from '../utils/error.js';
import type { AuthProvider } from './auth/authProvider.js';
import { SuperTokensService } from './auth/superTokensService.js';
import { HealthModule } from './routers/health/healthModule.js';
import {
  HealthBroadcastService,
  HealthRouter,
  LogStreamingModule,
  StaticFrontendRouter,
} from './routers/index.js';

export class HTTPServer {
  private app: Application;
  private server: Server | null = null;
  private healthBroadcastService: HealthBroadcastService;
  private authProvider: AuthProvider | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly config: Configuration,
    readonly applicationContext: ApplicationContext
  ) {
    this.app = express();
    this.healthBroadcastService = new HealthBroadcastService(applicationContext.pubSub);

    if (config.api.auth.enabled) {
      this.authProvider = new SuperTokensService(
        logger.child({ name: 'superTokensService' }),
        config
      );
    }

    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    if (this.config.api.cors_enabled !== false) {
      this.app.use(cors());
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async setupRouters() {
    const basePath = this.config.api.base_path || '/';
    const graphqlModules = [HealthModule];
    if (this.config.api.log_streaming_enabled) {
      graphqlModules.push(LogStreamingModule);
    }

    await Promise.all(
      [
        // new GraphQLRouter(
        //   this.logger.child({ name: 'graphql' }),
        //   server,
        //   {
        //     applicationContext: this.applicationContext,
        //     logger: this.logger.child({ name: 'graphql-resolver' }),
        //     pubSub: this.applicationContext.pubSub,
        //   },
        //   graphqlModules
        // ),
        new HealthRouter(this.healthBroadcastService),
        ...(this.config.frontend.enabled ? [] : []),
      ].map(async (router) => {
        await router.initialize();
        this.app.use(basePath, router.router);
      })
    );

    if (this.config.frontend.enabled) {
      const router = new StaticFrontendRouter(
        this.logger.child({ name: 'frontend' }),
        this.config.frontend.local_path,
        join(this.config.frontend.local_path, 'index.html')
      );
      await router.initialize();
      this.app.use(this.config.frontend.base_path, router.router);
    }
  }

  public initialize = async (): Promise<void> => {
    await this.healthBroadcastService.initialize();

    try {
      if (this.authProvider) {
        await this.authProvider.initialize(this.app);
      }

      await this.setupRouters();
      this.logger.debug(`Loaded routers`);

      if (this.authProvider) {
        await this.authProvider.onPostInitialize(this.app);
      }
    } catch (e: unknown) {
      this.logger.error('Failed to load routers', { error: toError(e) });
      void this.shutdown();
      return;
    }

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
    await this.authProvider?.shutdown();
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
