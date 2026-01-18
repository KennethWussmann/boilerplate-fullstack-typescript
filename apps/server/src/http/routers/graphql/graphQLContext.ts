import type { PubSub } from 'graphql-yoga';
import type { Logger } from 'winston';
import type { ApplicationContext } from '../../../applicationContext.js';
import type { LogEntryData } from '../../../log-streaming/index.js';
import type { ServerHealthGQL } from './generated/base.js';

export type HealthUpdatedEvent = [health: ServerHealthGQL];
export type LogEntryEvent = [entry: LogEntryData];

type Topics = {
  'health:updated': HealthUpdatedEvent;
  'log:entry': LogEntryEvent;
};

export type GraphQLPubSub = PubSub<Topics>;

export type GraphQLContext = {
  applicationContext: ApplicationContext;
  logger: Logger;
  pubSub: GraphQLPubSub;
};
