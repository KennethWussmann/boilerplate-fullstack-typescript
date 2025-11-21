import { DateTimeResolver, VoidResolver } from 'graphql-scalars';
import type { ResolversGQL } from './generated/index.js';

export const scalars: Partial<ResolversGQL> = {
  Void: VoidResolver,
  DateTime: DateTimeResolver,
};
