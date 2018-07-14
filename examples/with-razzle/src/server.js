import Rogue from '@roguejs/app/server'
import serveStatic from 'serve-static'

import App from './App'

const publicDir = process.env.RAZZLE_PUBLIC_DIR
const bundleUrl = require(process.env.RAZZLE_ASSETS_MANIFEST).client.js

const app = new Rogue(App, { bundleUrl })

app.preuse(serveStatic(publicDir))

export default app