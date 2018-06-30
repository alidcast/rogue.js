import express from 'express'
import { renderApp, renderHtml } from 'rogue'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { getLoadableState } from 'loadable-components/server'

<% if (css.emotion) { %>
import { renderStylesToString } from 'emotion-server'
<% } else if (css.styledComponents) { %>
import { ServerStyleSheet } from 'styled-components'
<% } %>

import App from '<%= appPath %>'

const processTags = async RoutableApp => {
  const tags = {}

  const loadableState = await getLoadableState(RoutableApp)
  tags.loadables = loadableState.getScriptTag()
  
  <% if (css.styledComponents) { %>
  const sheet = new ServerStyleSheet()
  const getStylesFromApp = (App) => sheet.collectStyles(RoutableApp)
  tags.styles = sheet.getStyleTags()
  <% } %>

  return tags
}

const processMarkup = markup => {
  <% if (css.emotion) { %>
  return renderStylesToString(markup)
  <% } else { %>
  return markup
  <% } %>
}

const app = express()

app
  .disable('x-powered-by')
  // TODO make dynamic
  .use(express.static('./.rogue/build/public'))
  .get('*', async (req, res) => {

    const { markup, data, tags } = await renderApp({
      req,
      res,
      App,
      processMarkup,
      processTags
    })
    
    if (res.finished) return // redirected
    
    const helmet = Helmet.renderStatic()

    const html = renderHtml({ 
      helmet,
      markup, 
      data, 
      headTags: [
        <% if (css.styledComponents) { %>tags.styles<% } %>
      ],
      bodyTags: [
        tags.loadables
      ] 
    })
    
    try {
      res.send(html)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  })

export default app