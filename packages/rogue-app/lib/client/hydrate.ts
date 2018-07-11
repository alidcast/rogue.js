import React, { createElement as h } from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadComponents } from 'loadable-components'
import { APP_ID, DATA_KEY } from '../shared/constants'

function getSsrData () {
  return typeof window !== undefined ? window[DATA_KEY] : {}
}

export default function hydrateApp (App: React.ComponentType<any>) {
  const props = getSsrData()
  return loadComponents().then(() => (
    hydrate(
      h(BrowserRouter, {}, h(App, props)), 
      document.getElementById(APP_ID)
    )   
  ))
}