import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadComponents } from 'loadable-components'
import { APP_ID, DATA_KEY } from '../shared/constants'

export default function hydrate (App: React.ComponentType<any>) {
  const data = getSsrData()
  
  return loadComponents().then(() => (
    ReactDOM.hydrate(
      h(BrowserRouter, {}, h(App, data)), 
      document.getElementById(APP_ID)
    )   
  ))
}

function getSsrData () {
  return typeof window !== undefined ? window[DATA_KEY] : {}
}