import { Repeater } from 'graphql-yoga';
import type { LogEntryData } from '../../../../log-streaming/index.js';
import type { LogEntryEvent } from '../../graphql/graphQLContext.js';
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
  message: entry.message,
  metadata: entry.metadata,
});

export const logStreamingSubscription: Partial<ResolversGQL> = {
  Subscription: {
    logStream: {
      subscribe: (_, __, { applicationContext, pubSub }) => {
        const logStreamingService = applicationContext.logStreamingService;
        if (!logStreamingService) {
          throw new Error('Log streaming is not enabled');
        }

        const transport = logStreamingService.getTransport();
        if (!transport) {
          throw new Error('Log streaming transport not initialized');
        }

        const cachedLogs = transport.getCachedLogs();

        return new Repeater<LogEntryData>(async (push, stop) => {
          for (const entry of cachedLogs) {
            push(entry);
          }

          const subscription = pubSub.subscribe('log:entry');

          stop.then(() => {
            subscription.return?.();
          });

          for await (const eventTuple of subscription as AsyncIterable<LogEntryEvent>) {
            push(eventTuple[0]);
          }
        });
      },
      resolve: (entry: LogEntryData) => mapToLogEntry(entry),
    },
  },
};
