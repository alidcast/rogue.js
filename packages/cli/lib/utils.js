const fs = require('fs-extra')
const path = require('path')
const { BUILD_PATH, TMP_DIR } = require('./constants')

const appDirectory = fs.realpathSync(process.cwd())

exports.join = function (...strs) {
  return path.join(...strs).replace(/\\/g, '/')
}

const resolve = exports.resolve = function resolve (...strs) {
  return path.resolve(...strs).replace(/\\/g, '/')
}

const resolveApp = exports.resolveApp = function (...strs) {
  return resolve(appDirectory, ...strs)
}

exports.resolveOwn = function (...strs) {
  return resolve(__dirname, '../..', ...strs)
}

// fs operations don't resolve files without extensions
// so we check both js and ts extensions manually
const resolveFile = exports.resolveFile = function (filePath) {
  const exts = ['.js', '.jsx', '.ts', '.tsx']
  for (let i = 0; i < exts.length; i ++) {
    if (fs.existsSync(`${filePath}${exts[i]}`)) return `${filePath}${exts[i]}`
  }
  return null
}

// looks for app entry as specific in 'main' property in package.json or in specific backup paths
exports.getSrcPath = function (defaultPaths) {
  const pkg = require(resolveApp('package.json'))

  let srcPath 
  if (pkg.main) {
    srcPath = resolveFile(pkg.main)
    if (!srcPath) throw Error(`Could not find your app in ${pkg.main} as specified in your 'package.json'.`)
  } else {
    defaultPaths.forEach(path => {
      if (!srcPath) srcPath = resolveFile(path)
    })
    if (!srcPath) throw Error(`Could not locate your app in your root or 'src/' directory.`)
  }
  return srcPath
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

exports.getApp = function () {
  const appPath = resolveApp(BUILD_PATH)
  delete require.cache[require.resolve(appPath)]
  return require(appPath).default
}


