const { createElement: h, cloneElement: hc } = require('react')
const { StaticRouter } = require('react-router-dom')
const { renderToString } = require('react-dom/server')
const { getLoadableState } = require('loadable-components/server')
const loadPropsFromTree = require('./loadPropsFromTree')
const { getContext } = require('./context')

module.exports = async function renderRoute(RoutableApp, routerContext, { req, res }) {
  let RoutableApp = h(
    props => h(StaticRouter, { context: routerContext, location: req.url }, h(RoutableApp, props))
  )

  const ctx = getContext(RoutableApp, { req, res })

  // Resolve anync components first so that we can check for their initial props
  const loadableState = await getLoadableState(RoutableApp)
  ctx.app.bodyTags.push(loadableState.getScriptTag())

  const data = await loadPropsFromTree(RoutableApp, ctx)
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