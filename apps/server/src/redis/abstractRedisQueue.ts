import { type JobsOptions, Queue } from 'bullmq';
import type { Logger } from 'winston';
import type { QueueConfiguration } from './schema.js';
import type { RedisJob } from './types.js';

export abstract class AbstractRedisQueue<I extends RedisJob<unknown>> {
  public queue: Queue;

  constructor(
    protected readonly logger: Logger,
    public readonly config: QueueConfiguration
  ) {
    this.queue = new Queue<I>(this.config.name, {
      connection: this.config.connection,
    });
  }

  public initialize: () => Promise<void> | void = () => {
    this.logger.info('Initialized queue');
  };

  public shutdown: () => Promise<void> | void = async () => {
    await this.queue.close();
    this.logger.info('Stopped queue');
  };

  public add = async (job: I, options?: JobsOptions) => {
    return await this.queue.add(job.id, job, options);
  };
}
