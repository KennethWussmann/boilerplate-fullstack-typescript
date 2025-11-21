import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { DEFAULT_API_URL, DEFAULT_WS_URL } from '../constants';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL || DEFAULT_WS_URL;

// HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: API_URL,
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
  })
);

// Split links based on operation type
const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
