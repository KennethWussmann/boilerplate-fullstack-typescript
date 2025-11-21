import type { ResolversGQL, ServerHealthGQL } from '../../graphql/index.js';

export const healthSubscription: Partial<ResolversGQL> = {
  Subscription: {
    health: {
      subscribe: (_, __, { applicationContext: { pubSub } }) => pubSub.subscribe('health:updated'),
      resolve: (info: ServerHealthGQL) => info,
    },
  },
};
