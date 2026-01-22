import type { BaseAdapter } from '@bull-board/api/baseAdapter';
import type { ConnectionOptions } from 'bullmq';
import type { Logger } from 'winston';
import type { Configuration } from '../config/index.js';
import type { AbstractRedisWorker } from './abstractRedisWorker.js';
import { ExampleWorker } from './exampleWorker.js';
import type { WorkerConfiguration } from './schema.js';

export class RedisService {
  private workerConfigurations: Map<string, WorkerConfiguration> = new Map();
  private workers: AbstractRedisWorker<any, unknown>[] = [];

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

    this.workers = [
      new ExampleWorker(this.logger.child({ name: 'exampleWorker' }), this.getConfig('example')),
    ];
  }

  public initialize = async () => {
    if (!this.config.enabled) {
      return;
    }
    await Promise.all(
      this.workers
        .filter((worker) => worker.config.enabled)
        .map(async (worker) => worker.initialize())
    );
  };

  public shutdown = async () => {};

  public getConnectionOptions = (): ConnectionOptions => ({
    host: this.config.host,
    port: this.config.port,
    password: this.config.password,
  });

  public getConfig = (name: string): WorkerConfiguration => {
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

  public getBullBoardAdapters = (): BaseAdapter[] => [
    // TODO: Fill with bullmq adapter from queues
    // new BullMQAdapter(<queue>),
  ];
}
