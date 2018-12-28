import rogue from '@roguejs/app/server'
import serveStatic from 'serve-static'

import App from '__APP_PATH__'

const app = rogue(App, 'bundle.js')

app.use(serveStatic(`.rogue/build/public`))

export default app