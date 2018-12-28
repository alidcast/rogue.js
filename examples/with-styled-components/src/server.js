import rogue from '@roguejs/app/server'
import { BUNDLE_SRC, PUBLIC_DIR } from '@roguejs/cli'
import serveStatic from 'serve-static'
import ReactDOM from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import App from './App'

const app = rogue(App, BUNDLE_SRC, {
  renderToString(node, ctx) {
    const sheet = new ServerStyleSheet()
    const html = ReactDOM.renderToString(sheet.collectStyles(node))
    ctx.app.headTags.push(sheet.getStyleTags())
    return html
  },
})

app.use(serveStatic(PUBLIC_DIR))

export default app