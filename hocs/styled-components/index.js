const { isServer } = require('../../index')

const { createElement: h } = require('react')
const { ThemeProvider } = require('styled-components')


const withStyles = (theme = {}) => App => {
  function RogueStyleProvider (props) {
    return h(ThemeProvider, { theme }, h(App, props))
  }

  return RogueStyleProvider
}

module.exports = withStyles