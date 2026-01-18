import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { getHttpApiUrl, getWsApiUrl, isApiEnabled } from './api-url';

const httpLink = new HttpLink({
  uri: getHttpApiUrl(),
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: getWsApiUrl(),
  })
);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const apolloClient = isApiEnabled()
  ? new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    })
  : null;
