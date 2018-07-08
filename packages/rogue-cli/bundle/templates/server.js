import Rogue from '@roguejs/app/server'
import serveStatic from 'serve-static'
import { Helmet } from 'react-helmet'

import App from '<%= appPath %>'

const app = new Rogue({
  Helmet,
  App
})

app.preuse(serveStatic(`.rogue/build/public`))

export default app