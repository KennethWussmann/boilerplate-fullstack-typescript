import { AbstractRedisWorker } from './abstractRedisWorker.js';

export type ExampleJob = {
  id: string;
  isoTimestamp: string;
};

export type ExampleJobOutput = {
  unixTimestamp: number;
};

/**
 * This is an example Worker.
 * It is located in an atypical location, usually workers should be at /src/<domain>/<name>Worker.ts
 */
export class ExampleWorker extends AbstractRedisWorker<ExampleJob, ExampleJobOutput> {
  public run = (job: ExampleJob) => {
    this.logger.info('Converting timestamp', { job });
    return {
      unixTimestamp: new Date(job.isoTimestamp).getTime(),
    };
  };
}
