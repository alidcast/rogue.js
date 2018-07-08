const serialize = require('serialize-javascript')
const { APP_ID, DATA_KEY } = require('../shared/constants')

module.exports = function toHtml ({
  helmet, 
  markup,
  data,
  bundleUrl,
  headTags, 
  bodyTags
}) {
  return `<!doctype html> 
  <html ${helmet.htmlAttributes.toString()}>
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${(headTags || []).join('/n')}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="${APP_ID}">${markup}</div>
      <script src="${bundleUrl || 'bundle.js'}" defer></script>
      <script>window.${DATA_KEY} = ${serialize(data)};</script>
      ${(bodyTags || []).join('/n')}
    </body>
  </html>`
}