
// https://github.com/iliakan/detect-node
const isServer = exports.isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'

exports.initRedirect = res => location => {
    if (isServer) {
      res.writeHead(302, { Location: location })
      res.end()
    } else {
      window.location.replace(location)
    }
  }
  