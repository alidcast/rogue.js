import express from 'express'
import { renderApp, renderHtml } from 'rogue/server'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { join } from 'path'

<% if (css.emotion) { %>
import { renderStylesToString } from 'emotion-server'
<% } else if (css.styledComponents) { %>
import { ServerStyleSheet } from 'styled-components'
<% } %>

import App from '<%= appPath %>'

const processTags = async RoutableApp => {
  const tags = {}

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

// TODO production dir?
const publicDir = join(__dirname, '/public').replace(/\\/g, '/')

app
  .disable('x-powered-by')
  .use(express.static(publicDir))
  .get('*', async (req, res) => {
    console.log(req.url)

    // TODO handle source maps
    if (req.url.match(/.map$/)) return

    try {
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
    
      res.send(html)
    } catch (err) {
      res.status(500)
      res.send(err.stack)
    }
  })

export default app