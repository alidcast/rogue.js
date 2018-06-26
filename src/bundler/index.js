const fs = require('fs')
const Bundler = require('parcel-bundler')

const {
  resolveApp,
  resolveOwn,
  transferFile
} = require('./utils')

const { 
  ROGUE_DIR,
  TMP_DIR,
  CACHE_DIR,
  BUILD_DIR, 
  BUILD_PUBLIC_DIR,
  BUILD_FILE,
  SERVER,
  CLIENT
} = require('./constants')

const isProd = process.env.NODE_ENV === 'production'

const appPath = resolveApp('src/App')

// Check if user has certain file, otherwise copy its template over.
// Returns the resulting path.
const getOptionalPath = (targetFile, processTransfer = null) => {
  const appPath = resolveApp(`src/${targetFile}`) // leave file extension open to user 
  if (fs.existsSync(appPath)) return appPath
  const templatePath = resolveOwn(`src/templates/${targetFile}.js`)
  const tmpPath = resolveApp(`${TMP_DIR}/${targetFile}.js`)
  transferFile(templatePath, tmpPath, processTransfer)
  return tmpPath
}

const getOptions = env => ({
  target: env === SERVER ? 'node' : 'browser',
  outDir: env === SERVER ? BUILD_DIR : BUILD_PUBLIC_DIR,
  outFile: BUILD_FILE,
  publicUrl: './',
  watch: !isProd,
  cache: !isProd,
  cacheDir: CACHE_DIR,
  minify: isProd,
  sourceMaps: isProd,
  hmrHostname: SERVER ? 'server-bundle' : 'client-bundle',
  hmrPort: 0,
  detailedReport: true
})

module.exports = function bundler (env) {
  if (!fs.existsSync(ROGUE_DIR)) fs.mkdirSync(ROGUE_DIR)
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR)

  // let entryPath
  // if (env === SERVER) {
  //   entryPath = getOptionalPath('server', (file) => {
  //     return file
  //       .replace('TEMPORARY_APP_PATH', appPath)
  //       // .replace('TEMPORARY_DOCUMENT_PATH', getOptionalPath('Document'))
  //   })
  // } else if (env === CLIENT) {
  //   entryPath = getOptionalPath('client', (file) => {
  //     return file.replace('TEMPORARY_APP_PATH', appPath)
  //   })
  // }
  return new Bundler(resolveApp('.rogue/tmp/server.js'), getOptions(env))
}
