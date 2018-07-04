const { createElement: h } = require('react')
const { ThemeProvider } = require('styled-components')

/*
* Styled Components Hoc to configure styles for server side rendering.
*
* Should be used as follows: 
*     withStyles(theme)(App)
* 
* Initializing the hoc is optional. But our hoc must be imported so that we know to configure SRR support.
*/
const withStyles = (theme = {}) => App => {
  function RogueStyleProvider (props) {
    return h(ThemeProvider, { theme }, h(App, props))
  }

  return RogueStyleProvider
}

module.exports = withStyles