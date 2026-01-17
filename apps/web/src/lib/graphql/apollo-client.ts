import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { DEFAULT_API_URL, getWebSocketUrl } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL || getWebSocketUrl(API_URL);

const httpLink = new HttpLink({
  uri: API_URL,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
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

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
