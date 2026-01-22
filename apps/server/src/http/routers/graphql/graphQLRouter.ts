import type { Server } from 'node:http';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { type Router as ExpressRouter, Router } from 'express';
import { createApplication, type Module } from 'graphql-modules';
import { useServer } from 'graphql-ws/use/ws';
import { createYoga, type YogaInitialContext } from 'graphql-yoga';
import type { Logger } from 'winston';
import { WebSocketServer } from 'ws';
import type { UserContext } from '../../authMiddleware.js';
import type { GraphQLContext } from './graphQLContext.js';

type BaseGraphQLContext = Omit<GraphQLContext, 'user'>;

export class GraphQLRouter {
  public readonly router: ExpressRouter = Router();
  constructor(
    private readonly logger: Logger,
    private readonly server: Server,
    private readonly baseContext: BaseGraphQLContext,
    private readonly modules: (() => Promise<Module>)[]
  ) {}

  async initialize() {
    this.logger.debug(`Starting GraphQL server`);

    const application = createApplication({
      modules: await Promise.all(this.modules.map((builder) => builder())),
    });
    const yoga = createYoga({
      plugins: [useGraphQLModules(application)],
      context: (initialContext: YogaInitialContext): GraphQLContext => {
        const req = initialContext.request as Request & { raw?: { user?: UserContext } };
        const user = (req.raw as { user?: UserContext } | undefined)?.user;
        return {
          ...this.baseContext,
          user,
        };
      },
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
        onSubscribe: async (ctx: any, _id: string, params: any) => {
          const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped(
            {
              ...ctx,
              req: ctx.extra.request,
              socket: ctx.extra.socket,
              params,
            }
          );
          const args = {
            schema,
            operationName: params.operationName,
            document: parse(params.query),
            variableValues: params.variables,
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

    this.logger.info(`GraphQL server started`);
  }

  async shutdown() {
    this.server.close();
    this.logger.info(`GraphQL server stopped`);
  }
}
