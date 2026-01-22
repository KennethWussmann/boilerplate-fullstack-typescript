import { defineConfig } from 'drizzle-kit';
import type { Configuration } from './src/index.js';

const configJson = process.env.CONFIG_JSON;
if (!configJson) {
  throw new Error(
    'No configuration found. Use the print-config.ts script to load the configuration into the CONFIG_JSON env var before using drizzle-kit!'
  );
}
const config: Configuration = JSON.parse(configJson);

if (!config.database.enabled) {
  throw new Error('Database is disabled');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.connection_url,
  },
});
