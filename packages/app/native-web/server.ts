import Rogue, { RogueOptions } from '../lib/rogue'
import ReactDOM from 'react-dom/server'
import { AppRegistry } from 'react-native-web'

export default function rogue(App, bundleUrl, options: RogueOptions = {}) {
  return new Rogue(
    App, 
    Object.assign(options, {
      renderToString(app, ctx) {
        AppRegistry.registerComponent('App', () => () => app)
        const { element, getStyleElement } = AppRegistry.getApplication('App')

        const styleElement = ReactDOM.renderToStaticMarkup(getStyleElement())
        ctx.app.headTags.push(styleElement)

        const html = ReactDOM.renderToString(element)
        return html
      },
      bodyTags: [
        `<script src=${bundleUrl} defer /></script>`,
      ].concat(options.bodyTags || []),
    })
  )
}