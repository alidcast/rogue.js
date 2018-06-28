import express from 'express'
import { renderHtml } from 'rogue'
import { renderToString } from 'react-dom/server'

<% if (css.emotion) { %>
import { renderStylesToString } from 'emotion-server'
<% } else if (css.styledComponents) { %>
import { ServerStyleSheet } from 'styled-components'
<% } %>

import App from '<%= appPath %>'
import Document from '<%= documentPath %>'

<% if (css.emotion) { %>
const renderApp = App => {
  return renderStylesToString(renderToString(App))
}
<% } else if (css.styledComponents) { %>
const sheet = new ServerStyleSheet()
const renderApp = App => {
  return renderToString(sheet.collectStyles(App))
}
const styles = sheet.getStyleTags()
<% } else { %>
const renderApp = App => {
  return renderToString(App)
}
<% } %>

const app = express()

app
  .use(express.static('public'))
  .get('*', async (req, res) => {

    try {
      const html = await renderHtml({
        req,
        res,
        Document,
        App,
        renderApp,
        <% if (css.styledComponents) { %>styles<% } %>
      })
      res.send(html)
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  })

export default app