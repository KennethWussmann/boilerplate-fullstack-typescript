import type { FileSystemFile } from './types.js';

/**
 * The AbstractFileSystem is an abstraction layer around actions that would usually happen on a local file system.
 * This allows later exchange with any kind of remote file system, but for now its only used by the LocalFileSystem implementation.
 */
export type AbstractFileSystem = {
  exists: (path: string) => Promise<boolean>;
  glob: (cwd: string, includeGlobs: string[], excludeGlobs: string[]) => Promise<FileSystemFile[]>;
  mkdir: (dir: string, options: { recursive: boolean }) => Promise<boolean>;
  writeFile: (path: string, content: string) => Promise<void>;
  readFile: (path: string) => Promise<Buffer>;
  remove: (path: string) => Promise<void>;
  createFileSystemFile: (absolutePath: string) => Promise<FileSystemFile>;
  resolve: (...paths: string[]) => Promise<string>;
};
