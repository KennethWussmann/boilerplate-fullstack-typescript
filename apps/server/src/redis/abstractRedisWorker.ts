import { Worker } from 'bullmq';
import type { Logger } from 'winston';
import type { WorkerConfiguration } from './schema.js';
import type { RedisJob } from './types.js';

export abstract class AbstractRedisWorker<I extends RedisJob<unknown>, O = unknown> {
  public worker: Worker;

  constructor(
    protected readonly logger: Logger,
    public readonly config: WorkerConfiguration
  ) {
    this.worker = new Worker<I>(
      this.config.name,
      async (job) => {
        return await this.run(job.data);
      },
      {
        concurrency: this.config.concurrency,
        connection: this.config.connection,
      }
    );
  }

  public initialize: () => Promise<void> | void = () => {
    this.logger.info('Initialized worker');
  };
  public shutdown: () => Promise<void> | void = async () => {
    await this.worker.close();
    this.logger.info('Stopped worker');
  };

  public abstract run: (job: I) => Promise<O> | O;
}
