import { AbstractRedisQueue } from './abstractRedisQueue.js';
import type { ExampleJob } from './exampleWorker.js';

export class ExampleQueue extends AbstractRedisQueue<ExampleJob> {}
