// https://github.com/iliakan/detect-node
const isServer = exports.isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'
