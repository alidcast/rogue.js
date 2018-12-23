import Rogue from '@roguejs/app/'
import ReactDOM from 'react-dom/server'
import { AppRegistry } from 'react-native-web'
import serveStatic from 'serve-static'
import App from './App'

const publicDir = process.env.RAZZLE_PUBLIC_DIR
const bundleUrl = require(process.env.RAZZLE_ASSETS_MANIFEST).client.js

// https://github.com/alidcastano/rogue.js/issues/78
// import rogue from '@roguejs/app/server.native'
// const app = rogue(App, bundleUrl)

const app = new Rogue(App, {
  renderToString(node, ctx) {
    AppRegistry.registerComponent('App', () => () => node)
    const { element, getStyleElement } = AppRegistry.getApplication('App')

    const styleElement = ReactDOM.renderToStaticMarkup(getStyleElement())
    ctx.app.headTags.push(styleElement)

    const html = ReactDOM.renderToString(element)
    return html
  },
  bodyTags: [
    `<script src=${bundleUrl} defer /></script>`,
  ],
})

app.preuse(serveStatic(publicDir))

export default app