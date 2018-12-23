import React from 'react'
import connect from 'connect'
import rogueMiddleware from './rogueMiddleware'

export type RogueOptions = { 
  headTags?: string[], 
  bodyTags?: string[],
  renderToString?: Function 
}

export default class Rogue {
  app: any 
  middlewares: Array<Function | [string, Function]>
  initialized: boolean 

  constructor (App: React.ComponentType<any>, options: RogueOptions = {}) {
    this.app = connect() 
    this.middlewares = [rogueMiddleware(App, options)]
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
  use (routeOrHandler: string | Function, handler?: Function) {
    if (handler) this.middlewares.unshift([routeOrHandler as string, handler])
    else this.middlewares.unshift(routeOrHandler as Function)
  }

  /**
   * Start app listening for requests.
   */
  listen (port: number, ...args) {
    if (!this.initialized) this.initMiddleware()
    return this.app.listen(port, ...args)
  }

  private initMiddleware () {
    const { app } = this
    this.middlewares.forEach(m => Array.isArray(m) ? app.use(m[0], m[1]) : app.use(m))
    this.initialized = true
  }
}
