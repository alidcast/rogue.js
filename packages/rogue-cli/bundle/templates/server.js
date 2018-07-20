import Rogue from '@roguejs/app/server'
import serveStatic from 'serve-static'

import App from '<%= appPath %>'

const app = new Rogue(App)

app.preuse(serveStatic(`.rogue/build/public`))

export default app