import { z } from 'zod';
import { LocalFileSystem } from '../file-system/index.js';
import type { ConfigurationCompositionOptions } from './configurationLoader.js';

const stringBoolSchema = z.union([z.boolean(), z.stringbool()]);
//const stringListSchema = z.string().transform((val) => val.split(';'));
const numberFromString = z
  .union([z.number(), z.string()])
  .transform((val) => (typeof val === 'number' ? val : Number(val)));

export const configurationSchema = z.object({
  version: z.string().default('develop'),
  serverName: z
    .string()
    .optional()
    .describe(
      'Arbitrary string that identifies this server. Useful for logs and metrics. Default: none'
    ),
  log: z.object({
    level: z
      .enum(['debug', 'info', 'warn', 'error', 'fatal', 'notice'])
      .default('info')
      .describe('Logging level for the application. Example: "info". Default: "info"'),
    format: z
      .enum(['json', 'text'])
      .default('json')
      .describe('Output format for log messages. Default: "json"'),
    destination: z
      .string()
      .optional()
      .describe(
        'Optional log file destination. If not specified, logs to console. Example: "./logs/app.log". Default: console output'
      ),
  }),
  database: z.object({
    enabled: stringBoolSchema
      .optional()
      .default(true)
      .describe('Enable the HTTP API. Example: "yes" or "no". Default: "yes"'),
    connection_url: z
      .string()
      .default('file:local.db')
      .describe(
        'Required if database is enabled. Connection URL to database. Default: "file:local.db"'
      ),
  }),
  api: z.object({
    enabled: stringBoolSchema
      .optional()
      .describe('Enable the HTTP API. Example: "yes" or "no". Default: "no"'),
    bind_address: z
      .string()
      .default('0.0.0.0')
      .describe('Bind address of the HTTP server. Example: "127.0.0.1". Default: "0.0.0.0"'),
    port: numberFromString
      .default(8080)
      .pipe(z.number().min(1).max(65535))
      .describe('Port the HTTP server should be listining on. Example: "8080". Default: "8080"'),
    base_path: z
      .string()
      .default('/')
      .describe('Serve the HTTP API on a different base path. Example: "/api". Default: "/"'),
    public_base_url: z.string().optional(),
    cors_enabled: stringBoolSchema
      .default(true)
      .describe(
        'Enable CORS (Cross-Origin Resource Sharing) for the HTTP API. Example: "yes" or "no". Default: "yes"'
      ),
  }),
  frontend: z.object({
    enabled: stringBoolSchema
      .default(false)
      .describe('Enable serving frontend static files. Example: "yes" or "no". Default: "no"'),
    base_path: z
      .string()
      .default('/')
      .describe('Serve the frontend on a different base path. Example: "/app". Default: "/"'),
    local_path: z
      .string()
      .default('./www')
      .describe(
        'Path to the frontend build directory. Example: "/app/apps/web/dist". Default: "./www"'
      ),
  }),
});

export type Configuration = z.infer<typeof configurationSchema>;
export type LogConfiguration = Configuration['log'];
export type LogFormat = LogConfiguration['format'];
export type LogLevel = LogConfiguration['level'];

export const defaultConfigOptions: ConfigurationCompositionOptions<typeof configurationSchema> = {
  schema: configurationSchema,
  cwd: process.env.CONFIG_PATH ?? process.cwd(),
  mapper: (env) => ({
    serverName: env('SERVER_NAME'),
    version: env('VERSION'),
    log: {
      level: env('LOG_LEVEL'),
      format: env('LOG_FORMAT'),
      destination: env('LOG_DESTINATION'),
      zigbee2mqtt: env('LOG_SQL'),
    },
    api: {
      enabled: env('API_ENABLED'),
      bind_address: env('API_BIND_ADDRESS'),
      port: env('API_PORT'),
      base_path: env('API_BASE_PATH'),
      cors_enabled: env('API_CORS_ENABLED'),
      public_base_url: env('PUBLIC_BASE_URL'),
    },
    database: {
      enabled: env('DATABASE_ENABLED'),
      connection_url: env('DATABASE_CONNECTION_URL'),
    },
    frontend: {
      enabled: env('FRONTEND_ENABLED'),
      base_path: env('FRONTEND_BASE_PATH'),
      local_path: env('FRONTEND_LOCAL_PATH'),
    },
  }),
  fileSystem: new LocalFileSystem(),
};
