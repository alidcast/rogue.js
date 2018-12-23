import React from 'react'
import { AppRegistry } from 'react-native-web'
import { BrowserRouter } from 'react-router-dom'
import { APP_ID, DATA_KEY } from '@roguejs/app/constants'

export default function hydrate(App) {
  AppRegistry.registerComponent('App', () => {
    return props => <BrowserRouter><App {...props} /></BrowserRouter>
  })
  
  AppRegistry.runApplication('App', {
    initialProps: typeof window !== undefined ? window[DATA_KEY] : {},
    rootTag: document.getElementById(APP_ID),
  })
}
