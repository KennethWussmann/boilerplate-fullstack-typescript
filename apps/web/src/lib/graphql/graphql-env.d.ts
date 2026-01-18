/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'DateTime': unknown;
    'LogEntry': { kind: 'OBJECT'; name: 'LogEntry'; fields: { 'level': { name: 'level'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'LogLevel'; ofType: null; }; } }; 'message': { name: 'message'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'metadata': { name: 'metadata'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; }; };
    'LogLevel': { name: 'LogLevel'; enumValues: 'DEBUG' | 'ERROR' | 'FATAL' | 'INFO' | 'NOTICE' | 'WARN'; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'health': { name: 'health'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ServerHealth'; ofType: null; }; } }; }; };
    'ServerHealth': { kind: 'OBJECT'; name: 'ServerHealth'; fields: { 'status': { name: 'status'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'ServerStatus'; ofType: null; }; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; }; };
    'ServerStatus': { name: 'ServerStatus'; enumValues: 'ONLINE' | 'STARTING' | 'STOPPING'; };
    'String': unknown;
    'Subscription': { kind: 'OBJECT'; name: 'Subscription'; fields: { 'health': { name: 'health'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ServerHealth'; ofType: null; }; } }; 'logStream': { name: 'logStream'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LogEntry'; ofType: null; }; } }; }; };
    'Void': unknown;
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: never;
  subscription: 'Subscription';
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}