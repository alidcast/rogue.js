import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadComponents } from 'loadable-components'
import { APP_ID, DATA_KEY } from '../shared/constants'

export default function hydrate (App: React.ComponentType<any>) {
  const data = getSsrData()
  
  return loadComponents().then(() => (
    mountComponent(
      h(BrowserRouter, {}, h(App, data)), 
      document.getElementById(APP_ID)
    )   
  ))
}


function getSsrData () {
  return typeof window !== undefined ? window[DATA_KEY] : null
}

// only hydrate if is initial render (prevents client-server mistach in development)
let isInitialRender = true
function mountComponent (element, container) {
  if (!isInitialRender) return ReactDOM.render(element, container)
  ReactDOM.hydrate(element, container)
  isInitialRender = false
}