import React, { createElement as h } from 'react'
import { AppRegistry } from 'react-native-web'
import { BrowserRouter } from 'react-router-dom'
import { APP_ID, DATA_KEY } from '../lib/constants'

export default function hydrate(App: React.ComponentType<any>) {
  AppRegistry.registerComponent('App', () => {
    return props => h(BrowserRouter, {}, h(App, props))
  })
  
  AppRegistry.runApplication('App', {
    initialProps: typeof window !== undefined ? window[DATA_KEY] : {},
    rootTag: document.getElementById(APP_ID),
  })
}
