import type { Server } from 'node:http';
import cors from 'cors';
import express, { type Application } from 'express';
import type { Logger } from 'winston';
import type { Configuration } from '../config/index.js';
import { HealthRouter } from './routers/index.js';

export class HTTPServer {
  private app: Application;
  private server: Server | null = null;

  constructor(
    private readonly config: Configuration,
    private readonly logger: Logger
  ) {
    this.app = express();
    this.setupMiddleware();
    this.setupRouters();
  }

  private setupMiddleware(): void {
    if (this.config.api.cors_enabled !== false) {
      this.app.use(cors());
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRouters(): void {
    const basePath = this.config.api.base_path || '/';
    [new HealthRouter()].forEach((router) => {
      this.app.use(basePath, router.router);
    });
  }

  public initialize = (): Promise<void> => {
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

      this.server = this.app.listen(port, () => {
        const basePath = this.config.api.base_path || '/';
        this.logger.info(`HTTP server started on port ${port} with base path ${basePath}`);
        resolve();
      });

      this.server.on('error', (error) => {
        this.logger.error('Failed to start HTTP server:', error);
        reject(error);
      });
    });
  };

  public shutdown = (): Promise<void> => {
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
