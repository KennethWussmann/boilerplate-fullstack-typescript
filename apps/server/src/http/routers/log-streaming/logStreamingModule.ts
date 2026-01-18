import { loadFiles } from '@graphql-tools/load-files';
import { createModule, type Module } from 'graphql-modules';
import { scalars } from '../index.js';
import { logStreamingSubscription } from './graphql/log-streaming.subscription.js';

export const LogStreamingModule = async (): Promise<Module> => {
  return createModule({
    id: 'log-streaming',
    dirname: import.meta.dirname,
    typeDefs: await loadFiles('**/*.graphql', {
      globOptions: {
        cwd: import.meta.dirname,
      },
    }),
    resolvers: [scalars, logStreamingSubscription],
  });
};
