import type { Configuration } from './configuration.js';

const MASK = '******';

// Patterns that indicate a field contains sensitive data
const SECRET_PATTERNS = [
  /password$/i,
  /token$/i,
  /secret$/i,
  /key$/i,
  /_key$/i,
  /api_key/i,
  /apikey/i,
  /webhook_url$/i,
  /credentials?$/i,
];

/**
 * Checks if a field name matches any secret pattern
 */
const isSecretField = (fieldName: string): boolean => {
  return SECRET_PATTERNS.some((pattern) => pattern.test(fieldName));
};

/**
 * Recursively masks sensitive fields in an object
 */
const maskObject = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => maskObject(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const masked: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (isSecretField(key) && typeof value === 'string' && value.length > 0) {
        // Mask the secret field
        masked[key] = MASK;
      } else if (typeof value === 'object') {
        // Recursively process nested objects/arrays
        masked[key] = maskObject(value);
      } else {
        // Keep non-secret primitives as-is
        masked[key] = value;
      }
    }
    return masked;
  }

  // Return primitives as-is
  return obj;
};

/**
 * Returns a deep copy of the configuration with all sensitive fields masked
 */
export const maskCredentials = (config: Configuration): Configuration => {
  return maskObject(config) as Configuration;
};
