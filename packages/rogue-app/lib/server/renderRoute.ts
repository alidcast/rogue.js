import { createElement as h } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import url from 'url'
import { isServer } from '../shared'

export default async function renderRoute (App, routerContext, { req, res }) {
  const ctx = getContext({ req, res }) as any
  const data = await getInitialProps(App, ctx)
  
  const RoutableApp = h(StaticRouter, { context: routerContext, location: req.url }, h(App, data))
  const rawMarkup = renderToString(RoutableApp)

  const { headTags, bodyTags, markupRenderers } = ctx.app
  const markup = reduceFns(markupRenderers, rawMarkup)

  return { markup, data, headTags, bodyTags }
}

function getContext ({ req, res }) {
  const { path: fullPath, pathname: path, query } = url.parse(req.url, true)
  return { 
    req,
    res,
    isServer,
    fullPath,
    path, 
    query,
    // Properties for configuring SSR support via `getInitialProps`
    app: {
      headTags: [],
      bodyTags: [],
      markupRenderers: [],
      routable (Component) {
        return h(StaticRouter, { context: {}, location: req.url }, Component)
      },
    }  
  }
}

async function getInitialProps (Component, ctx) {
  if (!Component.getInitialProps) return
  const props = await Component.getInitialProps(ctx)
  return props
} 

function reduceFns (fns, baseValue) {
  let currValue = baseValue 
  fns.forEach((fn) => { currValue = fn(currValue) })
  return currValue
}