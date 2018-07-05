/* eslint-disable global-require, import/no-dynamic-require */
const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath =>
  path.resolve(appDirectory, relativePath).replace(/\\/g, "/");

exports.resolveApp = resolveApp;

exports.resolveOwn = relativePath =>
  path.resolve(__dirname, "../..", relativePath).replace(/\\/g, "/");

// For some reason fs operations don't resolve files without extensions
// so we check both js and ts extensions and return the one that worked
const resolveFile = filePath => {
  if (fs.existsSync(`${filePath}.js`)) {
    return `${filePath}.js`;
  }
  if (fs.existsSync(`${filePath}.tsx`)) {
    return `${filePath}.tsx`;
  }
  if (fs.existsSync(`${filePath}.ts`)) {
    return `${filePath}.ts`;
  }

  return null;
};

exports.resolveFile = resolveFile;

// looks for app entry as specific in 'main' property in package.json or in specific backup paths
exports.getAndVerifySrcPath = defaultPaths => {
  const pkg = require(resolveApp("package.json"));

  let srcPath;
  if (pkg.main) {
    srcPath = resolveFile(pkg.main);
    if (!srcPath)
      throw Error(
        `Could not find your app in ${
          pkg.main
        } as specified in your 'package.json'.`
      );
  } else {
    defaultPaths.forEach(defaultPath => {
      if (!srcPath) srcPath = resolveFile(defaultPath);
    });
    if (!srcPath)
      throw Error(
        `Could not locate your app in your root or 'src/' directory.`
      );
  }
  return srcPath;
};

// E.g. app/src/App -> { srcDir: app/src, srcFile: App }
exports.separatePathSources = filePath => {
  const pathsToFile = filePath.split("/");
  const srcFile = pathsToFile.pop();
  const srcDir = pathsToFile.length > 0 ? pathsToFile.join("/") : "./";
  return { srcDir, srcFile };
};

exports.transferFile = (from, to, processFile = null) => {
  let file = fs.readFileSync(from, "utf8");
  if (processFile) file = processFile(file);
  fs.writeFileSync(to, file);
};

exports.requireUncached = module => {
  const appModule = resolveApp(module);
  delete require.cache[require.resolve(appModule)];
  return require(appModule);
};
