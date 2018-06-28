const { createElement: h, cloneElement: hc } = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const Helmet = require('react-helmet').default
const getPropsFromTree = require('./getPropsFromTree')

module.exports = async function renderApp({ 
  req, 
  res, 
  App,
  processMarkup,
  processTags
}) {
  const context = {}
  const location = req.url
  const RoutableApp = h(StaticRouter, { context, location }, h(App))
  
  let tags = {}
  if (typeof processTags === 'function') tags = await processTags(RoutableApp)

  const data = await getPropsFromTree(RoutableApp, { req })
  const rawMarkup = renderToString(hc(RoutableApp, data))
  const markup = typeof processMarkup === 'function' ? processMarkup(rawMarkup) : rawMarkup
  return { markup, data, tags }
}