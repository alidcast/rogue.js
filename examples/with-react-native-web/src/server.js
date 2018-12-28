import ReactDOM from 'react-dom/server'
import { AppRegistry } from 'react-native'
import Rogue from '@roguejs/app'
import serveStatic from 'serve-static'
import App from './App'

const app = new Rogue(App, {
  renderToString(node, ctx) {
    AppRegistry.registerComponent('App', () => () => node)
    const { element, getStyleElement } = AppRegistry.getApplication('App')
    const html = ReactDOM.renderToString(element)
    const styleElement = ReactDOM.renderToStaticMarkup(getStyleElement())
    ctx.app.headTags.push(styleElement)
    return html
  },
  bodyTags: [`<script src="bundle.js" defer /></script>`],
})

// https://github.com/alidcastano/rogue.js/issues/78
// import Rogue from '@roguejs/app/server.native'
// import serveStatic from 'serve-static'
// import ReactDOM from 'react-dom/server'
// import App from './App'
// const app = new Rogue(App, 'bundle.js')

app.use(serveStatic(`.rogue/build/public`))

export default app