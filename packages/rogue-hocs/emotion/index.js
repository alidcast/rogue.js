const { createElement: h } = require('react')
const { ThemeProvider } = require('emotion-theming')

/*
* Emotion Hoc to configure styles for server side rendering.
*
* Should be used as follows: 
*     withStyles(theme)(App)
*/
const withStyles = (theme = {}) => App => {
  function RogueEmotionProvider (props) {
    return h(ThemeProvider, { theme }, h(App, props))
  }

  RogueEmotionProvider.getInitialProps = async function (ctx) {
    ctx.app.markupRenderers.push(
      markup => require('emotion-server').renderStylesToString(markup)
    )

    let props = {}
    if (App.getInitialProps) props = await App.getInitialProps(ctx) || {}
    return props
  }

  
  RogueEmotionProvider.displayName = `withStyles(${App.displayName || App.name})`
  RogueEmotionProvider.WrappedComponent = App

  return RogueEmotionProvider
}

module.exports = withStyles 