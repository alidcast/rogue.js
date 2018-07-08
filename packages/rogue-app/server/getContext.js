const { StaticRouter } = require('react-router-dom')
const { createElement: h } = require('react')

const { isServer } = require('../shared/utils')

module.exports = function getContext (App, serverCtx = {}) {
  const redirect = initRedirect(serverCtx)
  const routable = initRoutable(serverCtx)

  if (isServer) {
    const ctx = Object.assign({}, serverCtx, { isServer, redirect })
    ctx.app = {
      routable,
      headTags: [],
      bodyTags: [],
      markupRenderers: []
    }
    return ctx 
  } else {
    return { isServer, redirect }
  }
}


function initRoutable (ctx) {
  const context = {}
  const location = ctx.req.url
  return function routable (Component) {
    return h(StaticRouter, { context, location }, Component)
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