const { isServer } = require('../shared/utils')

module.exports = function getContext (App, serverCtx = {}) {
  const redirect = initRedirect(serverCtx)

  if (isServer) {
    const ctx = Object.assign({}, serverCtx, { isServer, redirect })
    ctx.app = {
      Component: App,
      headTags: [],
      bodyTags: [],
      markupRenderers: []
    }
    return ctx 
  } else {
    return { isServer, redirect }
  }
}

function initRedirect (ctx) {
  return function redirect (location) {
    if (!!ctx.res) {
      ctx.res.writeHead(302, { Location: location })
      ctx.res.end()
    } else {
      window.location.replace(location)
    }
  }
}