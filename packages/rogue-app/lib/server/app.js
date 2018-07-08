const http = require('http')
const connect = require('connect')
const appMiddleware = require('./appMiddleware')

module.exports = class App {
  constructor (renderArgs) {
    this.app = connect() 
    this.preMiddlewares = []
    this.postMiddlewares = [appMiddleware(renderArgs)]
    this.initialized = false
  }
  
  /**
   * Get app middleware handler.
   */
  get render () {
    if (!this.initialized) this._initMiddleware()
    return this.app
  }

  /*
  * Middleware to be used before app middleware.
  */
  preuse (...args) {
    this.preMiddlewares.push(args)
  }

  /*
  * Middleware to be used after app middleware.
  */
  use (...args) {
    this.postMiddlewares.push(args)
  }

  _initMiddleware () {
    const { app } = this
    const useMiddleware = m => Array.isArray(m) ? app.use(m[0]/*path*/, m[1]/*handler*/) : app.use(m)
    this.preMiddlewares.forEach(useMiddleware)
    this.postMiddlewares.forEach(useMiddleware)
    this.initialized = true
  }
}
