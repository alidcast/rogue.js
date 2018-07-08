const { createElement: h } = require('react')
const { ThemeProvider } = require('styled-components')

/*
* Styled Components Hoc to configure styles for server side rendering.
*
* Should be used as follows: 
*     withStyles(theme)(App)
*/
const withStyles = (theme = {}) => App => {
  function RogueStyledProvider (props) {
    return h(ThemeProvider, { theme }, h(App, props))
  }

  RogueStyledProvider.getInitialProps = (ctx) => {
    if (ctx.isServer) {
      const { ServerStyleSheet } = require('styled-components')
      const sheet = new ServerStyleSheet()
      sheet.collectStyles(ctx.app.Component)
      ctx.app.headTags.push(sheet.getStyleTags())
    }
  }

  return RogueStyledProvider
}

module.exports = withStyles