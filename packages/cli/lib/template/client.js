import hydrate from '@roguejs/app/client'
import App from '__APP_PATH__'

hydrate(App)

if (module.hot) {
  module.hot.accept()
}