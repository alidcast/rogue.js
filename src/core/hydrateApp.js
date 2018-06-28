const { createElement: h } = require('react')
const { hydrate } = require('react-dom')
const { BrowserRouter } = require('react-router-dom')
const { APP_ID, DATA_KEY } = require('./constants')

function getSsrData () {
  let data = {}
  if (typeof window !== undefined) {
    data = JSON.parse(window[DATA_KEY])
  }
  return data
}

module.exports = function hydrateApp (App) {
  const data = getSsrData()

  return hydrate(
    h(BrowserRouter, {}, h(App, data)), 
    document.getElementById(APP_ID)
  )   
}