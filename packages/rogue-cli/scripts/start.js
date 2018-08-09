const http = require('http')
const { requireUncached } = require('../bundle/utils')
const { BUILD_PATH } = require('../bundle/constants')

const PORT = process.env.PORT || 3000

const getApp = () => requireUncached(BUILD_PATH).default

const serveApp = () => {
  const app = getApp()

  server = http.createServer(app.render)
  server.listen(PORT, error => {
    if (error){
      console.log(error)
    } else {
      console.log(`App starts on port: ${PORT}`)
    }
  })
}
  
serveApp();

  
