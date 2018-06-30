const fs = require('fs')
const path = require('path')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = exports.resolveApp = relativePath => {
  return path
    .resolve(appDirectory, relativePath)
    .replace(/\\/g, '/')
}

exports.resolveOwn = relativePath => {
  return path
    .resolve(__dirname, '../..', relativePath)
    .replace(/\\/g, '/')
}

// For some reason fs operations don't resolve files without extensions
// so we check both js and ts extensions and return the one that worked
exports.resolveFile = (filePath) => {
  if (fs.existsSync(`${filePath}.js`)) return `${filePath}.js`
  else if (fs.existsSync(`${filePath}.tsx`)) return `${filePath}.tsx`
  else if (fs.existsSync(`${filePath}.ts`)) return `${filePath}.ts`
  else return null
}

// E.g. app/src/App -> { srcDir: app/src, srcFile: App }
exports.separatePathSources = (filePath) => {
  const pathsToFile = filePath.split('/')
  const srcFile = pathsToFile.pop()
  const srcDir = pathsToFile.length > 0 ? pathsToFile.join('/') : './'
  return { srcDir, srcFile }
}

exports.transferFile = function (from, to, processFile = null) {
  let file = fs.readFileSync(from, 'utf8')
  if (processFile) file = processFile(file)
  fs.writeFileSync(to, file)
 }

exports.requireUncached = function (module){
  const appModule = resolveApp(module)
  delete require.cache[require.resolve(appModule)]
  return require(appModule)
}


