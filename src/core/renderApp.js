const { createElement: h, cloneElement: hc } = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { Helmet } = require('react-helmet')
const loadPropsFromTree = require('./loadPropsFromTree')

module.exports = async function renderApp({ 
  req, 
  res, 
  App,
  processMarkup,
  processTags
}) {
  const context = {}
  const location = req.url

  const RoutableApp = h(
    props => h(StaticRouter, { context, location }, h(App, props))
  )
  
  let tags = {}
  if (typeof processTags === 'function') tags = await processTags(RoutableApp)
  console.log('gettting props...')
  const data = await loadPropsFromTree(RoutableApp, { req, res })
  console.log('rendering...')
  const rawMarkup = renderToString(hc(RoutableApp, data))
  const markup = typeof processMarkup === 'function' ? processMarkup(rawMarkup) : rawMarkup

  return { markup, data, tags }
}