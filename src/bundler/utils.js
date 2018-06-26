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


