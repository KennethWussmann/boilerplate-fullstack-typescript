import type { ResolversGQL } from '../../graphql/index.js';

export const healthQuery: Partial<ResolversGQL> = {
  Query: {
    health: () => ({
      status: 'ONLINE',
      timestamp: new Date().toISOString(),
    }),
  },
};
