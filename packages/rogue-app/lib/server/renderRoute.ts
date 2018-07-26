import { createElement as h } from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { getLoadableState } from 'loadable-components/server'
import { getContext } from './context'

export default async function renderRoute (App, routerContext, { req, res }) {
  const ctx = getContext({ req, res }) as any
  const data = await getInitialProps(App, ctx)
  
  const RoutableApp = h(StaticRouter, { context: routerContext, location: req.url }, h(App, data))
  await loadAsyncComponents(RoutableApp, ctx)
  const rawMarkup = renderToString(RoutableApp)

  const { headTags, bodyTags, markupRenderers } = ctx.app
  const markup = reduceFns(markupRenderers, rawMarkup)

  return { markup, data, headTags, bodyTags }
}

async function getInitialProps (Component, ctx) {
  if (!Component.getInitialProps) return
  const props = await Component.getInitialProps(ctx)
  return props
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