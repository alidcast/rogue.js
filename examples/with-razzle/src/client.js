import hydrate from '@roguejs/app/client'
import App from './App'

hydrate(App)

if (module.hot) module.hot.accept() // hot reload client bundle