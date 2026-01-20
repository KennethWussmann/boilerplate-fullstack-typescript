import type { Router as ExpressRouter, Request, Response } from 'express';
import { Router } from 'express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import type { HealthBroadcastService } from './healthBroadcastService.js';

export class HealthRouter {
  public readonly router: ExpressRouter = Router();

  constructor(private readonly healthBroadcastService: HealthBroadcastService) {
    this.setupRoutes();
  }

  public initialize = async () => {};

  private setupRoutes(): void {
    this.router.get('/health', verifySession(), this.getHealth.bind(this));
  }

  private async getHealth(_req: Request, res: Response): Promise<void> {
    res.json({
      status: this.healthBroadcastService.status,
      timestamp: new Date().toISOString(),
    });
  }
}
