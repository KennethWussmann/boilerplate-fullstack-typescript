import { createBullBoard } from '@bull-board/api';
import type { BaseAdapter } from '@bull-board/api/baseAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';
import type { Logger } from 'winston';

export class BullBoardRouter {
  public readonly router: Router;

  constructor(logger: Logger, path: string, queues: BaseAdapter[]) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(path);
    createBullBoard({
      queues,
      serverAdapter,
    });
    this.router = Router();
    this.router.use(path, serverAdapter.getRouter());
    logger.info(`Enabled bull-board queue webinterface at: ${path}`);
  }

  public initialize = async () => {};
}
