export type DurationExpression =
  | `${number}${'ns' | 'μs' | 'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'mo' | 'y'}`
  | number;
