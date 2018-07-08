import 'babel-polyfill'

import hydrateApp from '@roguejs/app/client'
import { loadComponents } from 'loadable-components'

import App from '<%= appPath %>'

loadComponents().then(() =>
  hydrateApp(App)
)
