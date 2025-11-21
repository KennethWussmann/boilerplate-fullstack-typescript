import { loadFiles } from '@graphql-tools/load-files';
import { createModule, type Module } from 'graphql-modules';
import { scalars } from '../index.js';
import { healthQuery } from './graphql/health.query.js';
import { healthSubscription } from './graphql/health.subscription.js';

export const HealthModule = async (): Promise<Module> => {
  return createModule({
    id: 'health',
    dirname: import.meta.dirname,
    typeDefs: await loadFiles('**/*.graphql', {
      globOptions: {
        cwd: import.meta.dirname,
      },
    }),
    resolvers: [scalars, healthQuery, healthSubscription],
  });
};
