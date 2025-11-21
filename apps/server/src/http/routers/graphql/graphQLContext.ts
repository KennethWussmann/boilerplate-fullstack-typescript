import type { PubSub } from 'graphql-yoga';
import type { Logger } from 'winston';
import type { ApplicationContext } from '../../../applicationContext.js';
import type { ServerHealthGQL } from './generated/base.js';

export type HealthUpdatedEvent = [health: ServerHealthGQL];

type Topics = {
  'health:updated': HealthUpdatedEvent;
};

export type GraphQLPubSub = PubSub<Topics>;

export type GraphQLContext = {
  applicationContext: ApplicationContext;
  logger: Logger;
  pubSub: GraphQLPubSub;
};
