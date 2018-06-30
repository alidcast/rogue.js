const { isServer } = require('../../src/core/utils')
const { resolveApp } = require('../../src/bundler/utils')

const { createElement: h } = require(resolveApp('node_modules/react'))
const { Provider: ReduxProvider } = require(resolveApp('node_modules/react-redux'))

const STORE_CTX = 'store'
const STORE_CACHE = '__REDUX_STORE__'

/*
* Redux Hoc to configure store for server side rendering.
*
* Should be used as follows: 
*     withStore(createStore)(App)
* 
* The 'createStore' function will be passed the store's `initialState`.
*/
const withStore = createStore => App => {
  function getOrCreateStore (initialState = {}) {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) return createStore(initialState)
  
    if (!window[STORE_CACHE]) {
      window[STORE_CACHE] = createStore(initialState)
    }
    return window[STORE_CACHE]
  }
  
  function StoreProvider (props) {
    const store = getOrCreateStore(props.initialReduxState)
    return h(ReduxProvider, { store }, h(App, props))
  }

  StoreProvider.getInitialProps = function (ctx) {
    const store = getOrCreateStore()
    ctx[STORE_CTX] = store // provide store to app ctx
    return { initialReduxState: store.getState() }
  }

  return StoreProvider
}

module.exports = withStore