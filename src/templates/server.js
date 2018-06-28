import express from 'express'
import { renderApp, renderHtml } from 'rogue'
import { renderToString } from 'react-dom/server'

<% if (loadables) { %> import { getLoadableState } from 'loadable-components/server'<% } %>

<% if (css.emotion) { %>
import { renderStylesToString } from 'emotion-server'
<% } else if (css.styledComponents) { %>
import { ServerStyleSheet } from 'styled-components'
<% } %>

import App from '<%= appPath %>'

const processTags = async RoutableApp => {
  const tags = {}

  <% if (loadables) { %>
  const loadableState = await getLoadableState(RoutableApp)
  tags.loadables = loadableState.getScriptTag()
  <% } %>
  
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
  
    const html = renderHtml({ 
      markup, 
      data, 
      headTags: [
        <% if (css.styledComponents) { %>tags.styles<% } %>
      ],
      bodyTags: [
        <% if (loadables) { %>tags.loadables<% } %>
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