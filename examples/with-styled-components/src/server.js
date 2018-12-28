import rogue from '@roguejs/app/server'
import serveStatic from 'serve-static'
import ReactDOM from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import App from './App'

const app = rogue(App, 'bundle.js', {
  renderToString(node, ctx) {
    const sheet = new ServerStyleSheet()
    const html = ReactDOM.renderToString(sheet.collectStyles(node))
    ctx.app.headTags.push(sheet.getStyleTags())
    return html
  },
})

app.use(serveStatic(`.rogue/build/public`))

export default app