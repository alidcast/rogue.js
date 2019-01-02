const Bundler = require('parcel-bundler')
const fs = require('fs-extra')
const logger = require('./logger')

const {
  join,
  resolveApp,
  resolveOwn,
  getSrcPath,
  separatePathSources,
  transferFile,
  resolveFile
} = require('./utils')

const { 
  SERVER,
  CLIENT,
  ROGUE_DIR,
  TMP_DIR,
  CACHE_DIR,
  BUILD_DIR, 
  BUILD_PUBLIC_DIR,
  BUILD_FILE,
  CONFIG_FILE
} = require('./constants')

const isProd = process.env.NODE_ENV === 'production'

function createBundler (env) {
  const srcPath = getSrcPath(['App', 'src/App'])
  const { srcDir, srcFile } = separatePathSources(srcPath)

  // Replaced app path must be relative to build dir so that dependencies are compiled correctly.
  const appPath = '../../' +  srcPath.replace(/\\/g, '/')

  function getOrMakeEntryFile(entryFile) {
    const targetPath = resolveFile(join(srcDir, entryFile))
    if (targetPath) return targetPath
    const templatePath = resolveOwn(`cli/lib/template/${entryFile}.js`)
    const backupPath = resolveApp(`${TMP_DIR}/${entryFile}.js`)
    transferFile(templatePath, backupPath, entrySource => entrySource.replace('__APP_PATH__', appPath))
    return backupPath
  }

  const entryPath = env === SERVER ? getOrMakeEntryFile('server') : getOrMakeEntryFile('client')

  return new Bundler(entryPath, {
    production: isProd,
    target: env === SERVER ? 'node' : 'browser',
    outDir: env === SERVER ? BUILD_DIR : BUILD_PUBLIC_DIR,
    outFile: BUILD_FILE,
    cache: !isProd,
    cacheDir: env === SERVER ? `${CACHE_DIR}/server` : `${CACHE_DIR}/client`,
    minify: isProd,
    sourceMaps: !isProd,
    watch: !isProd,
    logLevel: 3,
    detailedReport: isProd
  })
}

async function prepBuild () {
  // see if not deleting rogue dir will improve performance (and not cause more problems than it solves)
  // await fs.emptyDir(ROGUE_DIR)
  await fs.emptyDir(TMP_DIR)
  await fs.emptyDir(BUILD_DIR)

  // copy over public assets
  const publicDir = resolveApp('public')
  if (fs.existsSync(publicDir)) {
    await fs.copy(publicDir, resolveApp(BUILD_PUBLIC_DIR), { 
      dereference: true, overwrite: true, errorOnExist: false 
    })
  }
}

async function bundle({ 
  onStart, onClientBundled, onServerBundled, onBundled 
} = {}) {
  await prepBuild()

  const clientBundler = createBundler(CLIENT)
  const serverBundler = createBundler(SERVER)

  let started = false
  let clientBundle
  let serverBundle 

  function emitStart() {
    if (!started && onStart) onStart() 
    started = true
  }

  function emitBundle() {
    if (clientBundle && onClientBundled) {
      onClientBundled(clientBundle)
    }
    if (serverBundle && onServerBundled) {
      onServerBundled(serverBundle)
    }
    if (clientBundle && serverBundle && onBundled) {
      onBundled({ clientBundle, serverBundle })
      started = false
      clientBundle = null
      serverBundle = null
    }
  }

  clientBundler.on('buildStart', () => {
    emitStart()
  })

  clientBundler.on('bundled', bundle => {
    if (!bundle) return
    clientBundle = bundle
    emitBundle()
  })

  clientBundler.on('buildError', error => {
    logger.error(error)
  })

  serverBundler.on('buildStart', () => {
    emitStart()
  })

  serverBundler.on('bundled', bundle => {
    if (!bundle) return
    serverBundle = bundle
    emitBundle()
  })

  serverBundler.on('buildError', error => {
    logger.error(error)
  })
  
  await clientBundler.bundle()
  await serverBundler.bundle()
}

module.exports = bundle