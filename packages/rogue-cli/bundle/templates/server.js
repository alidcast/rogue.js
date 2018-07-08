import Rogue from 'rogue/server'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet'

<% if (css.emotion) { %>
import { renderStylesToString } from 'emotion-server'
<% } else if (css.styledComponents) { %>
import { ServerStyleSheet } from 'styled-components'
<% } %>

import App from '<%= appPath %>'

const addHeadTags = async (RoutableApp, headTags) => {
  <% if (css.styledComponents) { %>
  const sheet = new ServerStyleSheet()
  const getStylesFromApp = (App) => sheet.collectStyles(RoutableApp)
  headTags.push(sheet.getStyleTags())
  <% } %>
  return headtags
}

const processMarkup = markup => {
  <% if (css.emotion) { %>
  return renderStylesToString(markup)
  <% } else { %>
  return markup
  <% } %>
}

const app = new Rogue({
  Helmet,
  App,
  addHeadTags,
  processMarkup
})

export default app