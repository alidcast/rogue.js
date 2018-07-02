process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

const { resolveApp } = require('../src/bundler/utils')
const { measureFileSizesBeforeBuild /*, printFileSizesAfterBuild */ } = require('react-dev-utils/FileSizeReporter')

const bundler = require('../src/bundler/index')
const { bundleApp } = require('./common')

const {  
  SERVER,
  CLIENT,
  BUILD_PATH
} = require('../src/bundler/constants')

const serverBundler = bundler(SERVER)
const clientBundler = bundler(CLIENT)


console.log('Creating an optimized production build...');

// const previousFileSizes = measureFileSizesBeforeBuild(resolveApp('./'))

bundleApp(clientBundler, serverBundler)