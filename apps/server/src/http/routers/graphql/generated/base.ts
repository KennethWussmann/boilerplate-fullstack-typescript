import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../graphQLContext.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: String; output: String; }
  Void: { input: String; output: String; }
};

export type LogEntryGQL = {
  __typename?: 'LogEntry';
  level: LogLevelGQL;
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
};

export type LogLevelGQL =
  | 'DEBUG'
  | 'ERROR'
  | 'FATAL'
  | 'INFO'
  | 'NOTICE'
  | 'WARN';

export type QueryGQL = {
  __typename?: 'Query';
  health: ServerHealthGQL;
};

export type ServerHealthGQL = {
  __typename?: 'ServerHealth';
  status: ServerStatusGQL;
  timestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type ServerStatusGQL =
  | 'ONLINE'
  | 'STARTING'
  | 'STOPPING';

export type SubscriptionGQL = {
  __typename?: 'Subscription';
  health: ServerHealthGQL;
  logStream: LogEntryGQL;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypesGQL = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  LogEntry: ResolverTypeWrapper<LogEntryGQL>;
  LogLevel: LogLevelGQL;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ServerHealth: ResolverTypeWrapper<ServerHealthGQL>;
  ServerStatus: ServerStatusGQL;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Void: ResolverTypeWrapper<Scalars['Void']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypesGQL = {
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  LogEntry: LogEntryGQL;
  Query: Record<PropertyKey, never>;
  ServerHealth: ServerHealthGQL;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  Void: Scalars['Void']['output'];
};

export interface DateTimeScalarConfigGQL extends GraphQLScalarTypeConfig<ResolversTypesGQL['DateTime'], any> {
  name: 'DateTime';
}

export type LogEntryResolversGQL<ContextType = GraphQLContext, ParentType extends ResolversParentTypesGQL['LogEntry'] = ResolversParentTypesGQL['LogEntry']> = {
  level?: Resolver<ResolversTypesGQL['LogLevel'], ParentType, ContextType>;
  message?: Resolver<ResolversTypesGQL['String'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypesGQL['String']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypesGQL['DateTime'], ParentType, ContextType>;
};

export type QueryResolversGQL<ContextType = GraphQLContext, ParentType extends ResolversParentTypesGQL['Query'] = ResolversParentTypesGQL['Query']> = {
  health?: Resolver<ResolversTypesGQL['ServerHealth'], ParentType, ContextType>;
};

export type ServerHealthResolversGQL<ContextType = GraphQLContext, ParentType extends ResolversParentTypesGQL['ServerHealth'] = ResolversParentTypesGQL['ServerHealth']> = {
  status?: Resolver<ResolversTypesGQL['ServerStatus'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypesGQL['DateTime']>, ParentType, ContextType>;
};

export type SubscriptionResolversGQL<ContextType = GraphQLContext, ParentType extends ResolversParentTypesGQL['Subscription'] = ResolversParentTypesGQL['Subscription']> = {
  health?: SubscriptionResolver<ResolversTypesGQL['ServerHealth'], "health", ParentType, ContextType>;
  logStream?: SubscriptionResolver<ResolversTypesGQL['LogEntry'], "logStream", ParentType, ContextType>;
};

export interface VoidScalarConfigGQL extends GraphQLScalarTypeConfig<ResolversTypesGQL['Void'], any> {
  name: 'Void';
}

export type ResolversGQL<ContextType = GraphQLContext> = {
  DateTime?: GraphQLScalarType;
  LogEntry?: LogEntryResolversGQL<ContextType>;
  Query?: QueryResolversGQL<ContextType>;
  ServerHealth?: ServerHealthResolversGQL<ContextType>;
  Subscription?: SubscriptionResolversGQL<ContextType>;
  Void?: GraphQLScalarType;
};


export type DateTimeGQL = Scalars["DateTime"];
export type VoidGQL = Scalars["Void"];