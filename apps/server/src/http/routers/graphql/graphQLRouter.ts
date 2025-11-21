import type { Server } from 'node:http';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { type Router as ExpressRouter, Router } from 'express';
import { createApplication } from 'graphql-modules';
import { useServer } from 'graphql-ws/use/ws';
import { createYoga } from 'graphql-yoga';
import type { Logger } from 'winston';
import { WebSocketServer } from 'ws';
import type { GraphQLContext } from './graphQLContext.js';

export class GraphQLRouter {
  public readonly router: ExpressRouter = Router();
  constructor(
    private readonly logger: Logger,
    private readonly server: Server,
    graphqlContext: GraphQLContext
  ) {
    const application = createApplication({
      modules: [],
    });
    const yoga = createYoga({
      plugins: [useGraphQLModules(application)],
      context: graphqlContext,
    });
    this.router.use(yoga.graphqlEndpoint, yoga);
    const wsServer = new WebSocketServer({
      server: this.server,
      path: yoga.graphqlEndpoint,
    });

    useServer(
      {
        execute: (args: any) => args.rootValue.execute(args),
        subscribe: (args: any) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx: any, msg: any) => {
          const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped(
            {
              ...ctx,
              req: ctx.extra.request,
              socket: ctx.extra.socket,
              params: msg.payload,
            }
          );

          const args = {
            schema,
            operationName: msg.payload.operationName,
            document: parse(msg.payload.query),
            variableValues: msg.payload.variables,
            contextValue: await contextFactory(),
            rootValue: {
              execute,
              subscribe,
            },
          };

          const errors = validate(args.schema, args.document);
          if (errors.length) return errors;
          return args;
        },
      },
      wsServer
    );
  }

  async initialize() {
    this.logger.debug(`Starting GraphQL server`);
    this.logger.info(`GraphQL server started`);
  }

  async shutdown() {
    this.server.close();
    this.logger.info(`GraphQL server stopped`);
  }
}
