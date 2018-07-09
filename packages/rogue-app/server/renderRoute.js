const { createElement: h, cloneElement: hc } = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { getLoadableState } = require('loadable-components/server')
const loadPropsFromTree = require('./loadPropsFromTree')
const { getContext } = require('./context')

module.exports = async function renderRoute({ 
  req, 
  res, 
  App
}) {
  let RoutableApp = h(
    props => h(StaticRouter, { context: {}, location: req.url }, h(App, props))
  )

  const ctx = getContext(RoutableApp, { req, res })

  const { headTags, bodyTags, markupRenderers } = ctx.app

  // Resolve anync components first so that we can check for their initial props
  const loadableState = await getLoadableState(RoutableApp)
  bodyTags.push(loadableState.getScriptTag())

  const data = await loadPropsFromTree(RoutableApp, ctx)
  
  RoutableApp = hc(RoutableApp, data)
  
  const rawMarkup = renderToString(RoutableApp)
  const markup = reduceFns(markupRenderers, rawMarkup)

  return { markup, data, headTags, bodyTags }
}

function reduceFns (fns, baseValue, extraArgs) {
  let currValue = baseValue 
  fns.forEach(async (fn) => {
    currValue = await fn(currValue, extraArgs)
  })
  return currValue
}