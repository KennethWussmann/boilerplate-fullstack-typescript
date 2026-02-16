import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { ConfigurationLoader, defaultConfigOptions } from '../src/index.js';

const loader = new ConfigurationLoader(defaultConfigOptions);
const config = await loader.loadConfig();

if (!config.database.enabled) {
  console.error('Database is disabled in configuration');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: config.database.connection_url });
const db = drizzle(pool);

console.log('Dropping all tables...');
await db.execute(sql`DROP SCHEMA public CASCADE`);
await db.execute(sql`CREATE SCHEMA public`);
await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);
console.log('Schema reset complete');

await pool.end();
