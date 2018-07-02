const { createElement: h, cloneElement: hc } = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
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

  const ctx = { req, res, redirect: initRedirect(res) }
  const data = await loadPropsFromTree(RoutableApp, ctx)

  RoutableApp = hc(RoutableApp, data)
  
  let tags = {}
  if (typeof processTags === 'function') tags = await processTags(RoutableApp)
  
  const rawMarkup = renderToString(RoutableApp)
  const markup = typeof processMarkup === 'function' ? processMarkup(rawMarkup) : rawMarkup

  return { markup, data, tags }
}