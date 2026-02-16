import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { ConfigurationLoader, defaultConfigOptions } from '../src/index.js';

const loader = new ConfigurationLoader(defaultConfigOptions);
const config = await loader.loadConfig();

const host = config.api.bind_address === '0.0.0.0' ? 'localhost' : config.api.bind_address;
const basePath = config.api.base_path.replace(/\/$/, '');
const url = `http://${host}:${config.api.port}${basePath}/graphql`;

const args = process.argv.slice(2);
let query: string | undefined;
let variables: Record<string, unknown> | undefined;

let i = 0;
while (i < args.length) {
  const arg = args[i];
  if (arg === '-v' || arg === '--variables') {
    variables = JSON.parse(args[++i]);
  } else if (arg === '-f' || arg === '--file') {
    query = await readFile(args[++i], 'utf-8');
  } else {
    query = arg;
  }
  i++;
}

if (!query && !process.stdin.isTTY) {
  try {
    query = readFileSync(0, 'utf-8').trim();
  } catch { }
}

if (!query) {
  process.stderr.write(`Usage: tsx scripts/gql.ts [-v JSON] [-f file] [query]\nEndpoint: ${url}\n`);
  process.exit(1);
}

const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, ...(variables && { variables }) }),
});

const result = await response.json();
process.stdout.write(JSON.stringify(result, null, 2) + '\n');

if ((result as { errors?: unknown[] }).errors) {
  process.exit(1);
}
