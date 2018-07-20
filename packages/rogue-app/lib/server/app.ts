import React from 'react'
import connect from 'connect'
import appMiddleware from './appMiddleware'

type MiddlewareArgs = Function/*handler*/ | [string/*route*/, Function/*handler*/]
type Middlewares = Array<MiddlewareArgs>

const defaults = {
  bundleUrl: 'bundle.js'
}

export default class App {
  app: any 
  preMiddlewares: Middlewares
  postMiddlewares: Middlewares
  initialized: boolean 

  constructor (App: React.ComponentType<any>, { bundleUrl } = defaults) {
    this.app = connect() 
    this.preMiddlewares = []
    this.postMiddlewares = [appMiddleware(App, bundleUrl)]
    this.initialized = false
  }
  
  /**
   * Get app middleware handler.
   */
  get render () {
    if (!this.initialized) this.initMiddleware()
    return this.app
  }

  /*
  * Middleware to be used before app middleware.
  */
  preuse (routeOrHandler: string | Function, handler?: Function) {
    if (handler) this.preMiddlewares.push([routeOrHandler as string, handler])
    else this.preMiddlewares.push(routeOrHandler as Function)
  }

  /*
  * Middleware to be used after app middleware.
  */
  use (routeOrHandler: string | Function, handler?: Function) {
    if (handler) this.postMiddlewares.push([routeOrHandler as string, handler])
    else this.postMiddlewares.push(routeOrHandler as Function)
  }

  /**
   * Start app listening for requests.
   */
  listen (port: number, ...args) {
    return this.app.listen(port, ...args)
  }

  private initMiddleware () {
    const { app } = this
    const useMiddleware = m => Array.isArray(m) ? app.use(m[0]/*path*/, m[1]/*handler*/) : app.use(m)
    this.preMiddlewares.forEach(useMiddleware)
    this.postMiddlewares.forEach(useMiddleware)
    this.initialized = true
  }
}
