import type { PubSub } from 'graphql-yoga';
import type { Logger } from 'winston';
import type { ApplicationContext } from '../../../applicationContext.js';

export type ExampleEvent = [id: string];

type Topics = {
  'example:updated': ExampleEvent;
};

export type GraphQLPubSub = PubSub<Topics>;

export type GraphQLContext = {
  applicationContext: ApplicationContext;
  logger: Logger;
  pubSub: GraphQLPubSub;
};
