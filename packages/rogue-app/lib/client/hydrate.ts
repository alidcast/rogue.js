import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadComponents } from 'loadable-components'
import { APP_ID, DATA_KEY } from '../shared/constants'

export default function hydrate (App: React.ComponentType<any>) {
  const data = getSsrData()
  
  // only hydrate if server rendered (prevents client-server mistach in development)
  const mount = !data ? ReactDOM.hydrate : ReactDOM.render

  return loadComponents().then(() => (
    mount(
      h(BrowserRouter, {}, h(App, data)), 
      document.getElementById(APP_ID)
    )   
  ))
}


function getSsrData () {
  return typeof window !== undefined ? window[DATA_KEY] : null
}