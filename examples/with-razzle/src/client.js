import { hydrate } from '@roguejs/app'
import App from './App'

hydrate(App)

if (module.hot) module.hot.accept() // hot reload client bundle