import  { StaticRouter } from 'react-router-dom'
import { createElement as h } from 'react'
import * as url from 'url'
import { isServer } from '../shared'

export function getContext ({ req, res }) {
  const routable = initRoutable(req.url)

  const { path: fullPath, pathname: path, query } = url.parse(req.url, true)

  const ctx = { 
    req,
    res,
    isServer,
    fullPath,
    path, 
    query
  } as any
  
  // Properties for configuring SSR support via `getInitialProps`
  ctx.app = {
    routable,
    headTags: [],
    bodyTags: [],
    markupRenderers: []
  }

  return ctx 
}


function initRoutable (location) {
  const context = {}
  return function routable (Component) {
    return h(StaticRouter, { context, location }, Component)
  }
}