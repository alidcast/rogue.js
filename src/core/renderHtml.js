const serialize = require('serialize-javascript')
const { Helmet } = require('react-helmet')
const { APP_ID, DATA_KEY } = require('./constants')

module.exports = function renderHtml ({ 
  markup,
  data,
  headTags, 
  bodyTags 
}) {
  const helmet = Helmet.renderStatic()
  return `<!doctype html> 
  <html ${helmet.htmlAttributes.toString()}>
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <title>My App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${(headTags || []).join('/n')}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="${APP_ID}">${markup}</div>
      <script src="bundle.js" defer></script>
      <script>window.${DATA_KEY} = ${serialize(data)};</script>
      ${(bodyTags || []).join('/n')}
    </body>
  </html>`
}