const { StaticRouter } = require('react-router-dom')
const { createElement: h } = require('react')
const url = require('url')
const { isServer } = require('../shared/utils')

exports.getContext = function (App, serverCtx = {}) {
  const redirect = initRedirect(serverCtx)
  const routable = initRoutable(serverCtx)

  if (isServer) {
    const { path: fullPath, pathname: path, query } = url.parse(serverCtx.req.url, true)

    const ctx = Object.assign({}, serverCtx, { 
      isServer, 
      redirect,
      fullPath,
      path, 
      query,
      // Dynamicaly set using `mergeMatchData` (see below)
      params: {}
    })
    
    // Properties for configuring SSR support via `getInitialProps`
    ctx.app = {
      routable,
      headTags: [],
      bodyTags: [],
      markupRenderers: []
    }
  
    return ctx 
  } else { // TODO
    return { isServer, redirect }
  }
}

// Some route information is unknown until we walk component tree, 
// so we'll export this helper to make sure we dynamically set it 
// consistently as we walk component tree
exports.includeMatchData = function (ctx, match) {
  ctx.params = match.params || {}
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