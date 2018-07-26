import http from 'http'
import app from './server'

const server = http.createServer(app.render)
const PORT = process.env.PORT || 3000

let currentApp = app

server.listen(PORT, error => {
  if (error) console.log(error)

  // open App url when server is started
  require('child_process').exec(
    `${process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open' } http://localhost:${PORT}`
  )
  
  console.log('🚀 started')
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!')

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...')
    server.removeListener('request', currentApp.render)
    const newApp = require('./server').default
    server.on('request', newApp.render)
    currentApp = newApp
  })
}
