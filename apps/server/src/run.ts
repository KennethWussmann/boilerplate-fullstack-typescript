import type { Logger } from 'winston';
import { ApplicationContext } from './applicationContext.js';
import {
  type Configuration,
  ConfigurationLoader,
  createLogger,
  defaultConfigOptions,
  maskCredentials,
} from './index.js';

export type RunOptions = {
  config?: Configuration;
  logger?: Logger;
};

export const printBanner = ({ version, serverName, api }: Configuration, configPath?: string) => {
  const na = 'n/a';
  const url = api.enabled
    ? api.public_base_url
      ? api.public_base_url
      : `http://${api.bind_address}:${api.port}${api.base_path}`
    : na;

  const LEFT_PAD = '   ';

  const entries: readonly [string, string | null | undefined][] = [
    ['Server Name:', serverName],
    ['API URL:', url],
    ['Config Path:', configPath],
  ];

  const maxKeyLen = Math.max(...entries.map(([k]) => k.length));
  const valueCol = maxKeyLen + 2;

  const infoLines = entries.map(([key, value]) => {
    const gap = valueCol - (key.length + 2);
    const pad = gap > 0 ? ' '.repeat(gap) : '';
    return `${key} ${pad}${value ?? na}`;
  });

  const logoBanner = [
    '  ██████                                                     ',
    ' ███    ███                                                  ',
    '  ███          ███     ██ ████ ███     ███    ███     ██ ████',
    '    ███      ██   ███   ███     ███   ███   ██   ███   ███   ',
    '       ███  █████████   ███      ███ ███   █████████   ███   ',
    ' ███    ███ ██          ███       █████    ██          ███   ',
    '   ██████     █████    ████        ███       █████    ████   ',
  ];

  const logoWidth = Math.max(...logoBanner.map((l) => l.length));
  const totalWidth = Math.max(...infoLines.map((l) => l.length), logoWidth);

  const versionBanner = version === 'develop' ? version : `v${version}`;

  const logoStart = Math.floor((totalWidth - logoWidth) / 2);

  const logoCentered = logoBanner.map((l) => ' '.repeat(logoStart) + l);
  const versionCentered =
    ' '.repeat(Math.floor((totalWidth - versionBanner.length) / 2)) + versionBanner;

  const lines = ['', ...logoCentered, versionCentered, '', ...infoLines, '', '']
    .map((line) => `${LEFT_PAD}${line}`)
    .join('\n');

  console.log(lines);
};

export const run = async ({ config, logger }: RunOptions) => {
  const loader = new ConfigurationLoader(defaultConfigOptions);
  const configFilePath = await loader.findConfigurationFile();
  config = config ?? (await loader.loadConfig());
  logger = logger ?? createLogger({ config: config.log }).child({ server: config?.serverName });
  if (config.log.format === 'text') {
    printBanner(config, configFilePath?.absolutePath);
  }
  logger.info('Starting server', {
    config: maskCredentials(config),
  });
  let appContext: ApplicationContext | null = null;

  try {
    // Initialize the application context with dependency injection
    appContext = new ApplicationContext(config, logger.child({ name: 'ApplicationContext' }));

    // Start all services
    await appContext.initialize();

    logger.info('Application started successfully');

    // Set up graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      if (appContext) {
        await appContext.shutdown();
      }
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start application:', error as Error);
    if (appContext) {
      await appContext.shutdown();
    }
    process.exit(1);
  }

  return appContext;
};

void run({});
