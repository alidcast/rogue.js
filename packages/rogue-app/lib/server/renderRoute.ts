import { createElement as h } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { getLoadableState } from 'loadable-components/server'
import loadProps from './loadProps'
import { getContext } from './context'

export default async function renderRoute (App, routerContext, { req, res }) {
  const ctx = getContext({ req, res }) as any

  // do not pass routerContext here since don't want any logic to persist as we walk tree to get initial props
  let RoutableApp = h(StaticRouter, { context: {}, location: req.url }, h(App))
  const data = await loadProps(RoutableApp, ctx)
  
  // make a fresh element and pass it routerContext since render logic (i.e. redirects) should now persist
  RoutableApp = h(StaticRouter, { context: routerContext, location: req.url }, h(App, data))
  await loadAsyncComponents(RoutableApp, ctx)
  const rawMarkup = renderToString(RoutableApp)

  const { headTags, bodyTags, markupRenderers } = ctx.app
  const markup = reduceFns(markupRenderers, rawMarkup)

  return { markup, data, headTags, bodyTags }
}

async function loadAsyncComponents (App, ctx) {
  const loadableState = await getLoadableState(App)
  ctx.app.bodyTags.push(loadableState.getScriptTag())
}

function reduceFns (fns, baseValue) {
  let currValue = baseValue 
  fns.forEach((fn) => { currValue = fn(currValue) })
  return currValue
}