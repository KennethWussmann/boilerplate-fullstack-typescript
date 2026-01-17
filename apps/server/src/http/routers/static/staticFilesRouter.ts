import express, {
  type Router as ExpressRouter,
  type Request,
  type Response,
  Router,
} from 'express';
import type { Logger } from 'winston';

export class StaticFrontendRouter {
  public readonly router: ExpressRouter = Router();

  constructor(
    private readonly logger: Logger,
    private readonly filePath: string,
    private readonly indexFilePath: string
  ) {
    this.setupRoutes();
  }

  public initialize = async () => {
    this.logger.info('Serving static files', { filePath: this.filePath });
  };

  private setupRoutes(): void {
    this.router.use(express.static(this.filePath));
    this.router.get('/{*splat}', (_req: Request, res: Response) => {
      res.sendFile(this.indexFilePath);
    });
  }
}
