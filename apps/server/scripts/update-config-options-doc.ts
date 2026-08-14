/**
 * This script automatically parses the Zod Configuration of the application and exports it to markdown files
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { z } from 'zod';
import { configurationSchema, defaultConfigOptions } from '../src/config/configuration.js';
import { LocalFileSystem } from '../src/file-system/localFileSystem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type ConfigOption = {
  path: string;
  envVar?: string;
  description?: string;
  defaultValue?: string;
  type: string;
  optional: boolean;
};

type SchemaDef = {
  type: string;
  innerType?: z.ZodType;
  in?: z.ZodType;
  element?: z.ZodType;
  options?: z.ZodType[];
  entries?: Record<string, string | number>;
  shape?: Record<string, z.ZodType>;
  values?: unknown[];
  defaultValue?: unknown;
};

const fs = new LocalFileSystem();

const START_MARKER_PATTERN = /<!--\s*Server\/Config(?::.*?)?\s*-->/;
const END_MARKER = '<!-- ./Server/Config -->';

const defOf = (schema: z.ZodType): SchemaDef => (schema as unknown as { def: SchemaDef }).def;

const envMapping = new Map<string, string>();

const collectEnvMappings = (value: unknown, path: string[]) => {
  if (typeof value === 'string') {
    envMapping.set(path.join('.'), value);
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      collectEnvMappings(nested, [...path, key]);
    }
  }
};

collectEnvMappings(
  defaultConfigOptions.mapper((key) => key),
  []
);

const renderType = (schema: z.ZodType): string => {
  const def = defOf(schema);
  switch (def.type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'date':
    case 'null':
    case 'undefined':
    case 'any':
    case 'unknown':
      return def.type;
    case 'literal':
      return (def.values ?? []).map((value) => JSON.stringify(value)).join(' | ');
    case 'enum':
      return Object.values(def.entries ?? {})
        .map((value) => JSON.stringify(value))
        .join(' | ');
    case 'union':
      return [...new Set((def.options ?? []).map(renderType))].join(' | ');
    case 'array':
      return def.element ? `${renderType(def.element)}[]` : 'array';
    case 'object':
      return 'object';
    case 'optional':
    case 'nullable':
    case 'default':
    case 'prefault':
      return def.innerType ? renderType(def.innerType) : 'unknown';
    case 'pipe':
      return def.in ? renderType(def.in) : 'unknown';
    default:
      return 'unknown';
  }
};

const analyzeField = (schema: z.ZodType, path: string[]): ConfigOption[] => {
  let current = schema;
  let optional = false;
  let defaultValue: unknown;
  let hasDefault = false;
  let description = schema.description;

  while (true) {
    const def = defOf(current);
    description ??= current.description;

    if (def.type === 'optional' || def.type === 'nullable') {
      optional = true;
      if (!def.innerType) break;
      current = def.innerType;
      continue;
    }
    if (def.type === 'default' || def.type === 'prefault') {
      if (!hasDefault) {
        defaultValue = def.defaultValue;
        hasDefault = true;
      }
      if (!def.innerType) break;
      current = def.innerType;
      continue;
    }
    if (def.type === 'pipe' && def.in && defOf(def.in).type !== 'string') {
      current = def.in;
      continue;
    }
    break;
  }

  const def = defOf(current);
  if (def.type === 'object' && def.shape) {
    return analyzeShape(def.shape, path);
  }

  return [
    {
      path: path.join('.'),
      envVar: envMapping.get(path.join('.')),
      description,
      defaultValue: hasDefault ? JSON.stringify(defaultValue) : undefined,
      type: renderType(current),
      optional,
    },
  ];
};

const analyzeShape = (shape: Record<string, z.ZodType>, path: string[]): ConfigOption[] =>
  Object.entries(shape).flatMap(([key, schema]) => analyzeField(schema, [...path, key]));

const configOptions = analyzeShape(defOf(configurationSchema).shape ?? {}, []);

const generateMarkdownTable = (options: ConfigOption[]): string => {
  let table = '| Config Path | Environment Variable | Type | Default | Required | Description |\n';
  table += '|-------------|---------------------|------|---------|----------|-------------|\n';

  const sorted = [...options].sort((a, b) => a.path.localeCompare(b.path));

  for (const opt of sorted) {
    const envVar = opt.envVar || '-';
    const type = opt.type.replace(/\|/g, '\\|');
    const defaultVal = opt.defaultValue ? opt.defaultValue.replace(/\|/g, '\\|') : '-';
    const required = opt.optional ? 'No' : 'Yes';
    const desc = opt.description || '-';

    table += `| \`${opt.path}\` | \`${envVar}\` | ${type} | ${defaultVal} | ${required} | ${desc} |\n`;
  }

  return table;
};

const markdownTable = generateMarkdownTable(configOptions);

const updateMarkdownContent = (content: string, table: string): string => {
  const lines = content.split('\n');
  const result: string[] = [];
  let insideConfigSection = false;
  let startMarkerFound = false;

  for (const line of lines) {
    if (START_MARKER_PATTERN.test(line)) {
      result.push(line);
      result.push('');
      result.push(table.trim());
      result.push('');
      insideConfigSection = true;
      startMarkerFound = true;
      continue;
    }

    if (line.trim() === END_MARKER) {
      result.push(line);
      insideConfigSection = false;
      continue;
    }

    if (insideConfigSection) {
      continue;
    }

    result.push(line);
  }

  if (!startMarkerFound) {
    throw new Error('Start marker not found in markdown file');
  }

  return result.join('\n');
};

const repoRoot = join(__dirname, '../../..');
const markdownFiles = await fs.glob(repoRoot, ['**/docs/**/*.md'], ['**/node_modules/**']);

let updatedCount = 0;
let skippedCount = 0;

for (const file of markdownFiles) {
  try {
    const content = (await fs.readFile(file.absolutePath)).toString('utf-8');

    if (!START_MARKER_PATTERN.test(content) || !content.includes(END_MARKER)) {
      skippedCount++;
      continue;
    }

    const updatedContent = updateMarkdownContent(content, markdownTable);
    await fs.writeFile(file.absolutePath, updatedContent);

    console.log(`✓ Updated: ${file.absolutePath}`);
    updatedCount++;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`✗ Error processing ${file.absolutePath}: ${error.message}`);
    }
  }
}

console.log(`\n✓ Documented ${configOptions.length} configuration options`);
console.log(`✓ Updated ${updatedCount} file(s)`);
if (skippedCount > 0) {
  console.log(`ℹ Skipped ${skippedCount} file(s) (no markers found)`);
}
