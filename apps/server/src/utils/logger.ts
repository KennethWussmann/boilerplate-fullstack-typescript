import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type { Configuration, LogFormat } from '../config/index.js';

const { createLogger: createWinstonLogger, format } = winston;

export { Logger } from 'winston';

type LoggerProperties = {
  config: Configuration['log'];
  meta?: Record<string, unknown>;
};

const textLine = () =>
  format.printf((info) => {
    const { timestamp, level, message, metadata } = info as {
      timestamp: string;
      level: string;
      message: string;
      metadata: Record<string, unknown>;
    };
    const hasMeta = Object.keys(metadata).length > 0;
    return `[${timestamp}] ${level}: ${message}${hasMeta ? ` | ${JSON.stringify(metadata)}` : ''}`;
  });

const reorder = format((info) => {
  const { timestamp, level, message, name, ...rest } = info;
  return {
    timestamp,
    level,
    name,
    message,
    ...rest,
  };
});

const logFormat: Record<LogFormat, winston.Logform.Format> = {
  json: format.combine(format.timestamp(), reorder(), format.json({ deterministic: false })),
  text: format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.align(),
    format.metadata({ fillExcept: ['timestamp', 'level', 'message'] }),
    textLine()
  ),
};

export const createLogger = ({ config, meta }: LoggerProperties) =>
  createWinstonLogger({
    level: config.level,
    format: logFormat[config.format],
    defaultMeta: meta,
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      notice: 3,
      info: 4,
      debug: 5,
    },
    transports: [
      new winston.transports.Console(),
      config.destination
        ? new DailyRotateFile({
            filename: '%DATE%.log',
            dirname: config.destination,
            utc: true,
            zippedArchive: true,
          })
        : undefined,
    ].filter((t): t is InstanceType<typeof winston.transports.Console> | DailyRotateFile => !!t),
  });
