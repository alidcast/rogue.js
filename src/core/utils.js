
// https://github.com/iliakan/detect-node
exports.isServer = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]'