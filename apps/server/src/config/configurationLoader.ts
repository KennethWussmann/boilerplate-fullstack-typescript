import YAML from 'yaml';
import type z from 'zod';
import { prettifyError, ZodError } from 'zod';
import type { AbstractFileSystem, FileSystemFile } from '../file-system/index.js';

export type ConfigurationCompositionOptions<S extends z.ZodTypeAny> = {
  schema: S;
  mapper: (env: (key: string) => any) => z.output<S>;
  cwd?: string;
  fileSystem: AbstractFileSystem;
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const mergePreferDefinedLeft = <T>(
  left: DeepPartial<T> | undefined,
  right: DeepPartial<T> | undefined
): DeepPartial<T> | undefined => {
  if (left === undefined) return right;
  if (right === undefined) return left;

  // If either side is not a plain object, prefer defined `left`.
  if (!isPlainObject(left) || !isPlainObject(right)) {
    return left !== undefined ? left : right;
  }

  const keys = new Set([...Object.keys(right), ...Object.keys(left)]);
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    // @ts-expect-error generic index
    const l = left[k];
    // @ts-expect-error generic index
    const r = right[k];
    out[k] = mergePreferDefinedLeft(l, r);
  }
  return out as DeepPartial<T>;
};

const pruneUndefinedKeepObjects = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => (isPlainObject(v) ? pruneUndefinedKeepObjects(v) : v))
      .filter((v) => v !== undefined) as unknown as T;
  }
  if (!isPlainObject(obj)) return obj;

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (isPlainObject(v) || Array.isArray(v)) {
      out[k] = pruneUndefinedKeepObjects(v as any);
    } else {
      out[k] = v;
    }
  }
  return out as T;
};

export class ConfigurationLoader<S extends z.ZodTypeAny> {
  private configuration: z.output<S> | null = null;

  constructor(private readonly options: ConfigurationCompositionOptions<S>) {}

  public loadConfig = async (): Promise<z.output<S>> => {
    try {
      this.configuration = await this.loadAndComposeConfig();
      return this.getConfiguration();
    } catch (e) {
      if (e instanceof ZodError) {
        console.error('Failed to parse configuration:\n', prettifyError(e));
        process.exit(1);
      } else {
        throw e;
      }
    }
  };

  public getConfiguration = (): z.output<S> => {
    if (!this.configuration) {
      throw new Error('Configuration has not been loaded');
    }
    return this.configuration;
  };

  public findConfigurationFile = async (): Promise<FileSystemFile | undefined> => {
    const configFiles = await this.options.fileSystem.glob(
      this.options.cwd ?? process.cwd(),
      ['config.{yaml,yml,json}'],
      []
    );
    if (configFiles.length > 1) {
      throw new Error(`Too many configuration files found: ${configFiles.length}`);
    }

    return configFiles.at(0);
  };

  private loadFileConfig = async (envConfig: z.output<S>): Promise<z.output<S>> => {
    const configFile = await this.findConfigurationFile();
    type Out = z.output<S>;
    let mergedRaw = envConfig as DeepPartial<Out>;

    if (configFile) {
      const configContent = (
        await this.options.fileSystem.readFile(configFile.absolutePath)
      ).toString('utf-8');

      let fileConfig: object;
      if (['.yaml', '.yml'].includes(configFile.ext.toLowerCase())) {
        fileConfig = YAML.parse(configContent);
      } else {
        fileConfig = JSON.parse(configContent);
      }

      mergedRaw =
        mergePreferDefinedLeft<Out>(
          envConfig as DeepPartial<Out>,
          fileConfig as DeepPartial<Out>
        ) ?? (envConfig as DeepPartial<Out>);
    }

    const merged = pruneUndefinedKeepObjects(mergedRaw) as Out;

    return this.options.schema.parse(merged);
  };

  private loadAndComposeConfig = async (): Promise<z.output<S>> => {
    const envConfig = this.options.mapper((key) => process.env[key]!);
    return this.loadFileConfig(envConfig);
  };
}
