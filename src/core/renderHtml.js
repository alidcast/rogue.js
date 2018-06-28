const { createElement: h } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const Helmet = require('react-helmet').default
const loadPropsFromTree = require('./loadPropsFromTree')

module.exports = async function renderToHtml({ 
  req, 
  res, 
  Document, 
  App,
  renderApp,
  styles
}) {
  const context = {}
  const location = req.url

  const RoutableApp = h(StaticRouter, { context, location }, h(App))
  
  const data = await loadPropsFromTree(RoutableApp, { req })
  if (res.finished) return // redirected 

  // TODO need to call app with app props
  const appMarkup = renderApp(RoutableApp)

  const helmet = Helmet.renderStatic()

  const doc = renderToStaticMarkup(h(Document, { helmet, data, styles }, null))
  
  return `
    <!doctype html> 
    ${doc.replace('DO NOT DELETE THIS OR YOU WILL BREAK YOUR APP', appMarkup)}
  `
}