import TransportStream from 'winston-transport';
import type { GraphQLPubSub } from '../http/routers/graphql/graphQLContext.js';

export type LogEntryData = {
  timestamp: string;
  level: string;
  name: string | null;
  message: string;
  metadata: string | null;
};

const LOG_CACHE_SIZE = 10;

const ESC = String.fromCharCode(0x1b);
const ANSI_REGEX = new RegExp(`${ESC}\\[[0-9;]*m`, 'g');

const stripAnsi = (str: string): string => str.replace(ANSI_REGEX, '').trim();

export class LogStreamingTransport extends TransportStream {
  private cache: LogEntryData[] = [];
  private pubSub: GraphQLPubSub;

  constructor(pubSub: GraphQLPubSub) {
    super({});
    this.pubSub = pubSub;
  }

  override log(info: Record<string, unknown>, callback: () => void): void {
    setImmediate(() => {
      const { timestamp, level, message, name, metadata: wrappedMeta, ...rest } = info;
      const metaObject =
        wrappedMeta && typeof wrappedMeta === 'object'
          ? (wrappedMeta as Record<string, unknown>)
          : rest;
      const { name: metaName, ...metaWithoutName } = metaObject;
      const loggerName = (name as string) ?? (metaName as string) ?? null;
      const hasMetadata = Object.keys(metaWithoutName).length > 0;
      const metadata = hasMetadata ? JSON.stringify(metaWithoutName) : null;

      const entry: LogEntryData = {
        timestamp: (timestamp as string) || new Date().toISOString(),
        level: (level as string).toUpperCase(),
        name: loggerName,
        message: stripAnsi(message as string),
        metadata,
      };

      this.cache.push(entry);
      if (this.cache.length > LOG_CACHE_SIZE) {
        this.cache.shift();
      }

      this.pubSub.publish('log:entry', entry);
    });

    callback();
  }

  getCachedLogs(): LogEntryData[] {
    return [...this.cache];
  }
}

export class LogStreamingService {
  private transport: LogStreamingTransport | null = null;

  constructor(private readonly pubSub: GraphQLPubSub) {}

  createTransport(): LogStreamingTransport {
    if (!this.transport) {
      this.transport = new LogStreamingTransport(this.pubSub);
    }
    return this.transport;
  }

  getTransport(): LogStreamingTransport | null {
    return this.transport;
  }
}
