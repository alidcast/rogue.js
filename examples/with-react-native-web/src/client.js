// import hydrate from'@roguejs/app/client.native'
// import App from './App'

// hydrate(App)

import { createElement as h } from 'react'
import { AppRegistry } from 'react-native'
import { BrowserRouter } from 'react-router-dom'
import { APP_ID, DATA_KEY } from '@roguejs/app/constants'
import App from './App'

AppRegistry.registerComponent('App', () => {
  return props => h(BrowserRouter, {}, h(App, props))
})

AppRegistry.runApplication('App', {
  initialProps: typeof window !== undefined ? window[DATA_KEY] : {},
  rootTag: document.getElementById(APP_ID),
})


if (module.hot) {
  module.hot.accept()
}