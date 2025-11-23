/**
 * This script automatically parses the Zod Configuration of the application and exports it to markdown files
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { LocalFileSystem } from '../src/file-system/localFileSystem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ConfigOption {
  path: string;
  envVar?: string;
  description?: string;
  defaultValue?: string;
  type: string;
  optional: boolean;
}

const fs = new LocalFileSystem();

// Markers for injecting documentation
const START_MARKER_PATTERN = /<!--\s*Server\/Config(?::.*?)?\s*-->/;
const END_MARKER = '<!-- ./Server/Config -->';

// Parse the configuration file
const configFilePath = join(__dirname, '../src/config/configuration.ts');
const sourceCode = (await fs.readFile(configFilePath)).toString('utf-8');

// Create a TypeScript source file
const sourceFile = ts.createSourceFile(
  'configuration.ts',
  sourceCode,
  ts.ScriptTarget.Latest,
  true
);

const configOptions: ConfigOption[] = [];
const envMapping: Map<string, string> = new Map();

// Extract environment variable mappings
function extractEnvMappings(node: ts.Node) {
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0];
    if (
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === 'defaultConfigOptions' &&
      declaration.initializer &&
      ts.isObjectLiteralExpression(declaration.initializer)
    ) {
      const mapperProperty = declaration.initializer.properties.find(
        (prop) =>
          ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'mapper'
      );

      if (
        mapperProperty &&
        ts.isPropertyAssignment(mapperProperty) &&
        ts.isArrowFunction(mapperProperty.initializer)
      ) {
        const returnExpr = mapperProperty.initializer.body;
        if (ts.isObjectLiteralExpression(returnExpr) || ts.isParenthesizedExpression(returnExpr)) {
          const objLiteral = ts.isParenthesizedExpression(returnExpr)
            ? returnExpr.expression
            : returnExpr;
          if (ts.isObjectLiteralExpression(objLiteral)) {
            extractEnvMappingsFromObject(objLiteral, []);
          }
        }
      }
    }
  }
}

function extractEnvMappingsFromObject(obj: ts.ObjectLiteralExpression, path: string[]) {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const key = prop.name.text;
      const newPath = [...path, key];

      if (ts.isCallExpression(prop.initializer)) {
        // This is an env() call
        const arg = prop.initializer.arguments[0];
        if (ts.isStringLiteral(arg)) {
          envMapping.set(newPath.join('.'), arg.text);
        }
      } else if (ts.isObjectLiteralExpression(prop.initializer)) {
        // Nested object
        extractEnvMappingsFromObject(prop.initializer, newPath);
      }
    }
  }
}

// Extract schema information
function extractSchemaInfo(node: ts.Node) {
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0];
    if (
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === 'configurationSchema' &&
      declaration.initializer &&
      ts.isCallExpression(declaration.initializer)
    ) {
      // This is z.object(...)
      const arg = declaration.initializer.arguments[0];
      if (ts.isObjectLiteralExpression(arg)) {
        extractFieldsFromObject(arg, []);
      }
    }
  }
}

function extractFieldsFromObject(obj: ts.ObjectLiteralExpression, path: string[]) {
  for (const prop of obj.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const key = prop.name.text;
      const newPath = [...path, key];
      const fieldInfo = analyzeZodField(prop.initializer, newPath);

      if (fieldInfo) {
        configOptions.push(fieldInfo);
      }
    }
  }
}

function analyzeZodField(expr: ts.Expression, path: string[]): ConfigOption | null {
  let currentExpr = expr;
  let isOptional = false;
  let defaultValue: string | undefined;
  let description: string | undefined;
  let baseType = 'unknown';

  // Follow the chain of method calls
  while (ts.isCallExpression(currentExpr)) {
    const methodName = getMethodName(currentExpr.expression);

    if (methodName === 'optional') {
      isOptional = true;
    } else if (methodName === 'default' && currentExpr.arguments.length > 0) {
      defaultValue = extractLiteralValue(currentExpr.arguments[0]);
    } else if (methodName === 'describe' && currentExpr.arguments.length > 0) {
      const arg = currentExpr.arguments[0];
      if (ts.isStringLiteral(arg)) {
        description = arg.text;
      }
    } else if (methodName === 'object' && currentExpr.arguments.length > 0) {
      // Nested object
      const arg = currentExpr.arguments[0];
      if (ts.isObjectLiteralExpression(arg)) {
        extractFieldsFromObject(arg, path);
        return null; // Don't add the object itself, only its children
      }
    } else if (methodName === 'enum' && currentExpr.arguments.length > 0) {
      baseType = 'enum';
      const arg = currentExpr.arguments[0];
      if (ts.isArrayLiteralExpression(arg)) {
        const values = arg.elements
          .filter(ts.isStringLiteral)
          .map((el) => `"${el.text}"`)
          .join(' | ');
        baseType = values;
      }
    } else if (methodName === 'string') {
      baseType = 'string';
    } else if (methodName === 'number') {
      baseType = 'number';
    } else if (methodName === 'boolean') {
      baseType = 'boolean';
    } else if (methodName === 'union' && currentExpr.arguments.length > 0) {
      // Handle union types
      const arg = currentExpr.arguments[0];
      if (ts.isArrayLiteralExpression(arg)) {
        const types: string[] = [];
        for (const el of arg.elements) {
          if (ts.isCallExpression(el)) {
            const typeName = getMethodName(el.expression);
            if (typeName) types.push(typeName);
          }
        }
        baseType = types.join(' | ');
      }
    } else if (methodName === 'pipe') {
      // Skip pipe, analyze the argument
      if (currentExpr.arguments.length > 0) {
        const pipeArg = currentExpr.arguments[0];
        if (ts.isCallExpression(pipeArg)) {
          const analysis = analyzeZodField(pipeArg, path);
          if (analysis) {
            baseType = analysis.type;
          }
        }
      }
    }

    // Move to the next expression in the chain
    if (ts.isPropertyAccessExpression(currentExpr.expression)) {
      currentExpr = currentExpr.expression.expression;
    } else {
      break;
    }
  }

  // Check if it's a reference to a schema variable
  if (ts.isIdentifier(currentExpr)) {
    const varName = currentExpr.text;
    if (varName === 'stringBoolSchema') {
      baseType = 'boolean | string';
    } else if (varName === 'numberFromString') {
      baseType = 'number | string';
    }
  }

  const pathStr = path.join('.');
  const envVar = envMapping.get(pathStr);

  return {
    path: pathStr,
    envVar,
    description,
    defaultValue,
    type: baseType,
    optional: isOptional,
  };
}

function getMethodName(expr: ts.Expression): string | null {
  if (ts.isPropertyAccessExpression(expr)) {
    return expr.name.text;
  }
  if (ts.isIdentifier(expr)) {
    return expr.text;
  }
  return null;
}

function extractLiteralValue(expr: ts.Expression): string {
  if (ts.isStringLiteral(expr)) {
    return `"${expr.text}"`;
  }
  if (ts.isNumericLiteral(expr)) {
    return expr.text;
  }
  if (expr.kind === ts.SyntaxKind.TrueKeyword) {
    return 'true';
  }
  if (expr.kind === ts.SyntaxKind.FalseKeyword) {
    return 'false';
  }
  return 'unknown';
}

// Visit all nodes twice - first for env mappings, then for schema
function visit(node: ts.Node, phase: 'env' | 'schema') {
  if (phase === 'env') {
    extractEnvMappings(node);
  } else {
    extractSchemaInfo(node);
  }
  ts.forEachChild(node, (child) => visit(child, phase));
}

// First pass: extract env mappings
visit(sourceFile, 'env');
// Second pass: extract schema info (now env mappings are available)
visit(sourceFile, 'schema');

// Generate markdown table
function generateMarkdownTable(options: ConfigOption[]): string {
  let table = '| Config Path | Environment Variable | Type | Default | Required | Description |\n';
  table += '|-------------|---------------------|------|---------|----------|-------------|\n';

  // Sort by path
  const sorted = [...options].sort((a, b) => a.path.localeCompare(b.path));

  for (const opt of sorted) {
    const envVar = opt.envVar || '-';
    const type = opt.type.replace(/\|/g, '\\|'); // Escape pipes in type unions
    const defaultVal = opt.defaultValue || '-';
    const required = opt.optional ? 'No' : 'Yes';
    const desc = opt.description || '-';

    table += `| \`${opt.path}\` | \`${envVar}\` | ${type} | ${defaultVal} | ${required} | ${desc} |\n`;
  }

  return table;
}

const markdownTable = generateMarkdownTable(configOptions);

// Function to update markdown content between markers
function updateMarkdownContent(content: string, table: string): string {
  const lines = content.split('\n');
  const result: string[] = [];
  let insideConfigSection = false;
  let startMarkerFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (START_MARKER_PATTERN.test(line)) {
      // Found start marker
      result.push(line);
      result.push('');
      result.push(table.trim());
      result.push('');
      insideConfigSection = true;
      startMarkerFound = true;
      continue;
    }

    if (line.trim() === END_MARKER) {
      // Found end marker
      result.push(line);
      insideConfigSection = false;
      continue;
    }

    // Skip lines inside the config section (they'll be replaced by the table)
    if (insideConfigSection) {
      continue;
    }

    result.push(line);
  }

  if (!startMarkerFound) {
    throw new Error('Start marker not found in markdown file');
  }

  return result.join('\n');
}

// Find all markdown files in docs directories
const repoRoot = join(__dirname, '../../..');
const markdownFiles = await fs.glob(repoRoot, ['**/docs/**/*.md'], ['**/node_modules/**']);

let updatedCount = 0;
let skippedCount = 0;

for (const file of markdownFiles) {
  try {
    const content = (await fs.readFile(file.absolutePath)).toString('utf-8');

    // Check if file contains the markers
    if (!START_MARKER_PATTERN.test(content) || !content.includes(END_MARKER)) {
      skippedCount++;
      continue;
    }

    // Update the content
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
