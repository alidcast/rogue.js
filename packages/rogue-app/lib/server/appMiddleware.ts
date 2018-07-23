import { Helmet } from 'react-helmet'
import renderRoute from './renderRoute'
import toHtml from './toHtml'

export default function appMiddleware (App: React.ComponentType<any>, bundleUrl: string) {
  return async function handler (req, res) {
    const routerContext = { url: null }
    const serverContext = { req, res }
  
    try {
      const { markup, data, headTags, bodyTags } = await renderRoute(App, routerContext, serverContext)
       
      // redirected (see: https://reacttraining.com/react-router/web/api/StaticRouter/context-object)
      if (routerContext.url) {
        res.writeHead(302, { Location: routerContext.url })
        res.end()
        return 
      }
    
      const helmet = Helmet.renderStatic()
      const html = toHtml({ helmet, markup, data, bundleUrl, headTags, bodyTags })
  
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Content-Length', Buffer.byteLength(html))
      res.end(html, 'utf8')
    } catch (err) {
      const content = JSON.stringify({ status: err.statusCode || 500, message: err.message, name: err.name }, undefined, 2)
      if (!(res.headerSent || res.headersSent)) {
        res.setHeader('Content-Type', 'text/json; charset=utf-8')
        res.setHeader('Content-Length', Buffer.byteLength(content))
      }
      res.end(content, 'utf-8')
    }
  }
}
