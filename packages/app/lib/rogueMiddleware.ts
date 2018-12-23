import { createElement as h } from 'react'
import ReactDOM from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import serialize from 'serialize-javascript'
import { APP_ID, DATA_KEY } from './constants'
import url from 'url'
import { isServer } from './utils'

export default function rogueMiddleware (App: React.ComponentType<any>, {
  headTags = [], bodyTags = [], renderToString
}: any = {}) {
  return async function handler (req, res) {
    const routerContext = { url: null }

    try {
      const ctx = getContext({ req, res }) as any
      const data = await getInitialProps(App, ctx)
      const app = h(StaticRouter, { context: routerContext, location: req.url }, h(App, data))
      
      const markup = typeof renderToString === 'function' 
        ? renderToString(app, ctx) 
        : ReactDOM.renderToString(app)
        
      // redirected (see: https://reacttraining.com/react-router/web/api/StaticRouter/context-object)
      if (routerContext.url) {
        res.writeHead(302, { Location: routerContext.url })
        res.end()
        return 
      }
      
      const helmet = Helmet.renderStatic()
      headTags.push(...ctx.app.headTags)
      bodyTags.push(...ctx.app.bodyTags)

      const html = toHtml({ markup, data, helmet, headTags, bodyTags })
  
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
      ${(headTags || []).join('')}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="${APP_ID}">${markup}</div>
      <script>window.${DATA_KEY} = ${serialize(data)};</script>
      ${(bodyTags || []).join('')}
    </body>
  </html>`
}

function getContext ({ req, res }) {
  const { path: fullPath, pathname: path, query } = url.parse(req.url, true)
  return { 
    req,
    res,
    isServer,
    fullPath,
    path, 
    query,
    // Properties for configuring SSR support via `getInitialProps`
    app: {
      headTags: [],
      bodyTags: [],
      routable (Component) {
        return h(StaticRouter, { context: {}, location: req.url }, Component)
      },
    }  
  }
}

async function getInitialProps (Component, ctx) {
  if (!Component.getInitialProps) return
  const props = await Component.getInitialProps(ctx)
  return props
}