import parseDurationUtil from 'parse-duration';
import { ApplicationError } from '../error/index.js';
import type { DurationExpression } from './types.js';

export const parseDuration = (
  exprOrMs: string | number,
  format: 'ns' | 'μs' | 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y' = 'ms'
): number => {
  if (typeof exprOrMs === 'number') {
    return exprOrMs;
  }
  const duration = parseDurationUtil(exprOrMs, format);
  if (!duration) {
    throw new ApplicationError(exprOrMs);
  }
  return duration;
};

export const toDeci = (exprOrMs: DurationExpression | number) => {
  return Math.floor(parseDuration(exprOrMs) / 100);
};
