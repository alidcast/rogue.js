const { createElement: h } = require('react')
const { ThemeProvider, ServerStyleSheet } = require('styled-components')

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

  RogueStyledProvider.getInitialProps = async function (ctx) {
    const sheet = new ServerStyleSheet()
    sheet.collectStyles(ctx.app.routable(h(App)))
    ctx.app.headTags.push(sheet.getStyleTags())
    
    let props = {}
    if (App.getInitialProps) props = await App.getInitialProps(ctx) || {}
    return props
  }

  RogueStyledProvider.displayName = `withStyles(${App.displayName || App.name})`
  RogueStyledProvider.WrappedComponent = App

  return RogueStyledProvider
}

module.exports = withStyles