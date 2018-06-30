import { hydrateApp } from 'rogue'
import { loadComponents } from 'loadable-components'

import App from '<%= appPath %>'

loadComponents().then(() =>
  hydrateApp(App)
)
