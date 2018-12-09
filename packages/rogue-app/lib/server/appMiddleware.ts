import { Helmet } from 'react-helmet'
import renderRoute from './renderRoute'
import serialize from 'serialize-javascript'
import { APP_ID, DATA_KEY } from '../shared/constants'

function toHtml ({ helmet, markup, data, headTags, bodyTags }) {
  return `<!doctype html> 
  <html ${helmet.htmlAttributes.toString()}>
    <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${(headTags || []).join(' ')}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="${APP_ID}">${markup}</div>
      <script>window.${DATA_KEY} = ${serialize(data)};</script>
      ${(bodyTags || []).join(' ')}
    </body>
  </html>`
}

export default function rogueMiddleware (App: React.ComponentType<any>, {
  headTags: customHeadTags = [], bodyTags: customBodyTags = []
}: any = {}) {
  return async function handler (req, res) {
    const routerContext = { url: null }
    const serverContext = { req, res }
  
    try {
      const {  
        markup, data, headTags: routeHeadTags, bodyTags: routeBodyTags 
      } = await renderRoute(App, routerContext, serverContext)

      // redirected (see: https://reacttraining.com/react-router/web/api/StaticRouter/context-object)
      if (routerContext.url) {
        res.writeHead(302, { Location: routerContext.url })
        res.end()
        return 
      }
      
      const helmet = Helmet.renderStatic()
      const headTags = [...customHeadTags, ...routeHeadTags]
      const bodyTags = [...customBodyTags, ...routeBodyTags]

      const html = toHtml({ helmet, markup, data, headTags, bodyTags })
  
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Content-Length', Buffer.byteLength(html))
      res.end(html, 'utf8')
    } catch (err) {
      const content = JSON.stringify({ status: err.statusCode || 500, message: err.message, name: err.name }, undefined, 2)
      // edge case: headers might be sent asynchronously before the error is caught
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/json; charset=utf-8')
        res.setHeader('Content-Length', Buffer.byteLength(content))
      }
      res.end(content, 'utf-8')
    }
  }
}
