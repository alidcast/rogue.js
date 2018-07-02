const { createElement: h, cloneElement: hc } = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { getLoadableState } = require('loadable-components/server')
const loadPropsFromTree = require('./loadPropsFromTree')
const { initRedirect } = require('../utils')

module.exports = async function renderApp({ 
  req, 
  res, 
  App,
  processMarkup,
  processTags
}) {
  const context = {}
  const location = req.url

  let RoutableApp = h(
    props => h(StaticRouter, { context, location }, h(App, props))
  )

  // Resolve anync components first so that we can check for their initial props
  const loadableState = await getLoadableState(RoutableApp)
  
  const ctx = { req, res, redirect: initRedirect(res) }
  const data = await loadPropsFromTree(RoutableApp, ctx)

  RoutableApp = hc(RoutableApp, data)
  
  let tags = {}
  if (typeof processTags === 'function') tags =  await processTags(RoutableApp)
  tags.loadables = loadableState.getScriptTag()

  const rawMarkup = renderToString(RoutableApp)
  const markup = typeof processMarkup === 'function' ? processMarkup(rawMarkup) : rawMarkup

  return { markup, data, tags }
}