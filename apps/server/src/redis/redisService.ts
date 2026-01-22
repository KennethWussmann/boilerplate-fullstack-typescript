import type { BaseAdapter } from '@bull-board/api/baseAdapter';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import type { ConnectionOptions } from 'bullmq';
import type { Logger } from 'winston';
import type { Configuration } from '../config/configuration.js';
import type { AbstractRedisQueue } from './abstractRedisQueue.js';
import type { AbstractRedisWorker } from './abstractRedisWorker.js';
import { ExampleQueue } from './exampleQueue.js';
import { ExampleWorker } from './exampleWorker.js';
import type { QueueConfiguration, WorkerConfiguration } from './schema.js';

export class RedisService {
  private workerConfigurations: Map<string, WorkerConfiguration> = new Map();
  private queueConfigurations: Map<string, QueueConfiguration> = new Map();
  private workers: AbstractRedisWorker<any, unknown>[] = [];
  private queues: AbstractRedisQueue<any>[] = [];

  constructor(
    private readonly logger: Logger,
    private readonly config: Configuration['redis']
  ) {
    if (!config.enabled) {
      return;
    }

    config.workers
      .filter((worker) => worker.enabled)
      .forEach((worker) => {
        this.workerConfigurations.set(worker.name, {
          ...worker,
          connection: this.getConnectionOptions(),
        });
      });

    config.queues
      .filter((queue) => queue.enabled)
      .forEach((queue) => {
        this.queueConfigurations.set(queue.name, {
          ...queue,
          connection: this.getConnectionOptions(),
        });
      });

    this.workers = [
      new ExampleWorker(
        this.logger.child({ name: 'exampleWorker' }),
        this.getWorkerConfig('example')
      ),
    ];

    this.queues = [
      new ExampleQueue(this.logger.child({ name: 'exampleQueue' }), this.getQueueConfig('example')),
    ];
  }

  public initialize = async () => {
    if (!this.config.enabled) {
      return;
    }
    await Promise.all([
      ...this.workers
        .filter((worker) => worker.config.enabled)
        .map(async (worker) => worker.initialize()),
      ...this.queues
        .filter((queue) => queue.config.enabled)
        .map(async (queue) => queue.initialize()),
    ]);
  };

  public shutdown = async () => {
    if (!this.config.enabled) {
      return;
    }
    await Promise.all([
      ...this.workers.map(async (worker) => worker.shutdown()),
      ...this.queues.map(async (queue) => queue.shutdown()),
    ]);
  };

  public getConnectionOptions = (): ConnectionOptions => ({
    host: this.config.host,
    port: this.config.port,
    password: this.config.password,
  });

  public getWorkerConfig = (name: string): WorkerConfiguration => {
    const worker = this.workerConfigurations.get(name);
    if (!worker) {
      const defaultConfig: WorkerConfiguration = {
        enabled: true,
        concurrency: 1,
        name,
        connection: this.getConnectionOptions(),
      };
      return defaultConfig;
    }
    return worker;
  };

  public getQueueConfig = (name: string): QueueConfiguration => {
    const queue = this.queueConfigurations.get(name);
    if (!queue) {
      const defaultConfig: QueueConfiguration = {
        enabled: true,
        name,
        connection: this.getConnectionOptions(),
      };
      return defaultConfig;
    }
    return queue;
  };

  public getBullBoardAdapters = (): BaseAdapter[] =>
    this.queues.map((queue) => new BullMQAdapter(queue.queue));

  public getQueue = <T extends AbstractRedisQueue<any>>(name: string): T | undefined =>
    this.queues.find((queue) => queue.config.name === name) as T | undefined;
}
