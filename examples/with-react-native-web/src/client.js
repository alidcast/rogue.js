import React from 'react'
import { AppRegistry } from 'react-native-web'
import { BrowserRouter } from 'react-router-dom'
import { APP_ID, DATA_KEY } from '@roguejs/app/constants'
import App from './App'

// https://github.com/alidcastano/rogue.js/issues/78
// import hydrate from '@roguejs/app/client.native'
// hydrate(App)

AppRegistry.registerComponent('App', () => {
  return props => <BrowserRouter><App {...props} /></BrowserRouter>
})

AppRegistry.runApplication('App', {
  initialProps: typeof window !== undefined ? window[DATA_KEY] : {},
  rootTag: document.getElementById(APP_ID),
})

if (module.hot) module.hot.accept() // hot reload client bundle