require('babel-polyfill')

const { createElement: h } = require('react')
const { hydrate } = require('react-dom')
const { BrowserRouter } = require('react-router-dom')
const { loadComponents } = require('loadable-components')
const { APP_ID, DATA_KEY } = require('../shared/constants')

function getSsrData () {
  return typeof window !== undefined ? window[DATA_KEY] : {}
}

module.exports = function hydrateApp (App) {
  const props = getSsrData()
  return loadComponents().then(() => 
    hydrate(
      h(BrowserRouter, {}, h(App, props)), 
      document.getElementById(APP_ID)
    )   
  )
}