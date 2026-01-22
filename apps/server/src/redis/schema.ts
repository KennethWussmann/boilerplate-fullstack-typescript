import type { ConnectionOptions } from 'bullmq';
import z from 'zod';

export const workerConfigurationSchema = z.object({
  enabled: z.boolean().default(true),
  name: z.string(),
  concurrency: z.number().default(1),
});

export type WorkerConfiguration = z.infer<typeof workerConfigurationSchema> & {
  connection: ConnectionOptions;
};

export const queueConfigurationSchema = z.object({
  enabled: z.boolean().default(true),
  name: z.string(),
});

export type QueueConfiguration = z.infer<typeof queueConfigurationSchema> & {
  connection: ConnectionOptions;
};
