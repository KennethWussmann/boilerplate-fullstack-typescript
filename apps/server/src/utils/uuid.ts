import { randomUUID } from 'node:crypto';

/**
 * Generate a UUID v4 using Node.js crypto module
 */
export function uuid(): string {
  return randomUUID();
}
