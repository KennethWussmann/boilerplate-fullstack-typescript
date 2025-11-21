import {
  access,
  mkdir as mkdirNode,
  readFile as readFileNode,
  unlink,
  writeFile as writeFileNode,
} from 'node:fs/promises';
import { parse as parseNode, resolve as resolveNode } from 'node:path';
import { glob } from 'glob';
import type { AbstractFileSystem } from './abstractFileSystem.js';
import type { FileSystemFile } from './types.js';

export class LocalFileSystem implements AbstractFileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  async glob(
    cwd: string,
    includeGlobs: string[],
    excludeGlobs: string[] = []
  ): Promise<FileSystemFile[]> {
    // Process all glob patterns in parallel to avoid deep promise chains
    const globPromises = includeGlobs.map((pattern) =>
      glob(pattern, {
        ignore: excludeGlobs,
        absolute: true,
        nodir: true,
        cwd,
      })
    );

    const fileArrays = await Promise.all(globPromises);
    const allFiles = fileArrays.flat();
    const uniqueFiles = [...new Set(allFiles)];

    return await Promise.all(uniqueFiles.map(async (path) => this.createFileSystemFile(path)));
  }

  async mkdir(dir: string, options: { recursive: boolean }): Promise<boolean> {
    try {
      await mkdirNode(dir, options);
      return true;
    } catch {
      return false;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    await writeFileNode(path, content, 'utf-8');
  }

  async readFile(path: string): Promise<Buffer> {
    return await readFileNode(path);
  }

  async remove(path: string): Promise<void> {
    await unlink(path);
  }

  async resolve(...paths: string[]): Promise<string> {
    return resolveNode(...paths);
  }

  async createFileSystemFile(absolutePath: string): Promise<FileSystemFile> {
    const { root, dir, base, ext, name } = parseNode(absolutePath);
    return {
      absolutePath,
      root,
      dir,
      base,
      ext,
      name,
    };
  }
}
