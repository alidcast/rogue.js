const { isServer } = require('../../src/core/utils')
const { resolveApp } = require('../../src/bundler/utils')

const { createElement: h } = require(resolveApp('node_modules/react'))
const { ThemeProvider } = require(resolveApp('node_modules/emotion-theming'))


const withStyles = (theme = {}) => App => {
  function StyleProvider (props) {
    return h(ThemeProvider, { theme }, h(App, props))
  }

  return StyleProvider
}

module.exports = withStyles 