import { createElement as h, cloneElement as hc } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { getLoadableState } from 'loadable-components/server'
import loadProps from './loadProps'
import { getContext } from './context'

export default async function renderRoute (App, routerContext, { req, res }) {
  let RoutableApp = h(
    props => h(StaticRouter, { context: routerContext, location: req.url }, h(App, props))
  )

  const ctx = getContext({ req, res }) as any

  // Resolve anync components first so that we can check for their initial props
  const loadableState = await getLoadableState(RoutableApp)
  ctx.app.bodyTags.push(loadableState.getScriptTag())

  const data = await loadProps(RoutableApp, ctx)
  RoutableApp = hc(RoutableApp, data)
  
  const { headTags, bodyTags, markupRenderers } = ctx.app

  const rawMarkup = renderToString(RoutableApp)
  const markup = reduceFns(markupRenderers, rawMarkup)

  return { markup, data, headTags, bodyTags }
}

function reduceFns (fns, baseValue) {
  let currValue = baseValue 
  fns.forEach((fn) => { currValue = fn(currValue) })
  return currValue
}