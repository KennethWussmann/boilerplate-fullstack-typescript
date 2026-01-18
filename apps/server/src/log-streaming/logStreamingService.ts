import TransportStream from 'winston-transport';
import type { GraphQLPubSub } from '../http/routers/graphql/graphQLContext.js';

export type LogEntryData = {
  timestamp: string;
  level: string;
  message: string;
  metadata: string | null;
};

const LOG_CACHE_SIZE = 10;

export class LogStreamingTransport extends TransportStream {
  private cache: LogEntryData[] = [];
  private pubSub: GraphQLPubSub;

  constructor(pubSub: GraphQLPubSub) {
    super({});
    this.pubSub = pubSub;
  }

  override log(info: Record<string, unknown>, callback: () => void): void {
    setImmediate(() => {
      const { timestamp, level, message, ...rest } = info;
      const metadata = Object.keys(rest).length > 0 ? JSON.stringify(rest) : null;

      const entry: LogEntryData = {
        timestamp: (timestamp as string) || new Date().toISOString(),
        level: (level as string).toUpperCase(),
        message: message as string,
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
