import { Repeater } from 'graphql-yoga';
import type { LogEntryData } from '../../../../log-streaming/index.js';
import type { LogEntryGQL, ResolversGQL } from '../../graphql/index.js';

const mapLogLevel = (level: string): LogEntryGQL['level'] => {
  const levelMap: Record<string, LogEntryGQL['level']> = {
    FATAL: 'FATAL',
    ERROR: 'ERROR',
    WARN: 'WARN',
    NOTICE: 'NOTICE',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
  };
  return levelMap[level] || 'INFO';
};

const mapToLogEntry = (entry: LogEntryData): LogEntryGQL => ({
  timestamp: entry.timestamp,
  level: mapLogLevel(entry.level),
  name: entry.name,
  message: entry.message,
  metadata: entry.metadata,
});

export const logStreamingSubscription: Partial<ResolversGQL> = {
  Subscription: {
    logStream: {
      subscribe: (_, args: { history?: boolean }, { applicationContext, pubSub }) => {
        const logStreamingService = applicationContext.logStreamingService;
        if (!logStreamingService) {
          throw new Error('Log streaming is not enabled');
        }

        const transport = logStreamingService.getTransport();
        if (!transport) {
          throw new Error('Log streaming transport not initialized');
        }

        const includeHistory = args.history !== false;
        const cachedLogs = includeHistory ? transport.getCachedLogs() : [];

        return new Repeater<LogEntryData>(async (push, stop) => {
          for (const entry of cachedLogs) {
            push(entry);
          }

          const subscription = pubSub.subscribe('log:entry');

          stop.then(() => {
            subscription.return?.();
          });

          for await (const entry of subscription) {
            push(entry);
          }
        });
      },
      resolve: (entry: LogEntryData) => mapToLogEntry(entry),
    },
  },
};
