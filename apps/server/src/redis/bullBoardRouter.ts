import { createBullBoard } from '@bull-board/api';
import type { BaseAdapter } from '@bull-board/api/baseAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';
import type { Logger } from 'winston';

export class BullBoardRouter {
  public readonly router: Router;

  constructor(logger: Logger, mountPath: string, basePath: string, queues: BaseAdapter[]) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(basePath);
    createBullBoard({
      queues,
      serverAdapter,
    });
    this.router = Router();
    this.router.use(mountPath, serverAdapter.getRouter());
    logger.info(`Enabled bull-board queue webinterface at: ${basePath}`);
  }

  public initialize = async () => {};
}
