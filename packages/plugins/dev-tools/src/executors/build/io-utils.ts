const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

export class IOUtils {
  public static readonly PACKAGE_JSON = 'package.json';

  public static toModulePath(fsPath: string, rootDir?: string): string {
    let rval: string = path.resolve(fsPath);
    if (!path.isAbsolute(fsPath) && rootDir) {
      rval = path.resolve(rootDir, fsPath);
    }
    return rval;
  }

  public static isDir(fsPath: string, rootDir?: string): boolean {
    return fs.statSync(IOUtils.toModulePath(fsPath, rootDir)).isDirectory();
  }

  public static toDir(fsPath: string, rootDir?: string): string {
    return IOUtils.isDir(fsPath, rootDir) ? fsPath : path.dirname(fsPath);
  }

  public static toFileList(fsPath: string, rootDir?: string): string[] {
    if (IOUtils.isDir(fsPath, rootDir)) {
      return fs
        .readdirSync(IOUtils.toModulePath(fsPath, rootDir))
        .filter((fn) => !IOUtils.isDir(path.join(fsPath, fn), rootDir))
        .map((fn) => IOUtils.toModulePath(path.join(fsPath, fn), rootDir));
    } else {
      return [];
    }
  }

  public static createDir(dirName: string, rootDir?: string): void {
    const dir = IOUtils.toModulePath(dirName, rootDir);
    if (!fs.existsSync(path.dirname(dir))) {
      this.createDir(path.dirname(dir));
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  public static createDirs(dirNames: string[], rootDir?: string): void {
    dirNames.forEach((dir) => this.createDir(dir, rootDir));
  }

  public static relativePath(
    from: string,
    to: string,
    rootDir?: string
  ): string {
    const orgCwd = process.cwd();
    const resolvedFrom = IOUtils.toModulePath(
      IOUtils.toDir(from, rootDir),
      rootDir
    );
    const resolvedTo = IOUtils.toModulePath(to, rootDir);
    process.chdir(resolvedFrom);
    const rval = path.relative(resolvedFrom, resolvedTo);
    process.chdir(orgCwd);
    return rval;
  }

  public static loadModulePackage(moduleName: string): unknown | undefined {
    const modulePath = IOUtils.findModulePath(moduleName);
    return !modulePath
      ? undefined
      : IOUtils.loadJSON(path.join(modulePath, IOUtils.PACKAGE_JSON));
  }

  public static findModulePath(moduleName: string): string | undefined {
    let rval;
    IOUtils.findNodeModulesDirs().some((nodeDir) => {
      if (fs.existsSync(path.join(nodeDir, moduleName, IOUtils.PACKAGE_JSON))) {
        rval = path.join(nodeDir, moduleName);
      }
      return !!rval;
    });
    return rval;
  }

  public static findNodeModulesDirs(): string[] {
    const root: string = path.resolve('/');
    const rval: string[] = [];
    [__dirname, process.cwd()].forEach((coreDir) => {
      let current = coreDir;
      while (current !== root) {
        const possible = path.join(current, 'node_modules');
        if (fs.existsSync(possible) && !rval.includes(possible)) {
          rval.push(possible);
        }
        current = path.dirname(current);
      }
    });
    rval.sort((a: string, b: string) => (a.length - b.length) * -1);
    return rval;
  }

  public static loadJSON<T>(fsPath: string, rootDir?: string): T | undefined {
    if (fs.existsSync(fsPath)) {
      return JSON.parse(
        fs.readFileSync(IOUtils.toModulePath(fsPath, rootDir), 'utf8')
      );
    }
    return undefined;
  }

  public static storeJSON(jsonObj: Record<string, any>, fsPath: string): void {
    fs.writeFileSync(fsPath, JSON.stringify(jsonObj, null, 2), 'utf8');
  }

  public static loadYamlFile<T>(fsPath: string, rootDir?: string): T {
    const fullPath: string = this.toModulePath(fsPath, rootDir);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Could not find file: ${fullPath}`);
    }
    return yaml.safeLoad(fs.readFileSync(fullPath, 'utf8')) as unknown as T;
  }
}
