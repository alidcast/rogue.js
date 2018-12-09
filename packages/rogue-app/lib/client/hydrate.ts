import React, { createElement as h } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { APP_ID, DATA_KEY } from '../shared/constants'

export default function hydrate (App: React.ComponentType<any>) {
  const data = typeof window !== undefined ? window[DATA_KEY] : {}
  
  return  ReactDOM.hydrate(
    h(BrowserRouter, {}, h(App, data)), 
    document.getElementById(APP_ID)
  )
}