const { isServer } = require('@roguejs/app')

const { createElement: h } = require('react')
const { Provider: ReduxProvider } = require('react-redux')

const STORE_CTX = 'store'

/*
* Redux Hoc to configure store for server side rendering.
*
* Should be used as follows: 
*     withStore(createStore)(App)
* 
* The 'createStore' function will be passed the store's `initialState`.
*/
const withStore = createStore => App => {
  let reduxStore = null
  function getOrCreateStore (initialState = {}) {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) return createStore(initialState)
    
    if (!reduxStore) {
      reduxStore = createStore(initialState)
    }
    return reduxStore
  }
  
  function RogueStoreProvider (props) {
    const store = getOrCreateStore(props.initialReduxState || {})
    return h(ReduxProvider, { store }, h(App, props))
  }

  RogueStoreProvider.getInitialProps = function (ctx) {
    const store = getOrCreateStore()
    ctx[STORE_CTX] = store // provide store to app ctx
    return { initialReduxState: store.getState() }
  }

  return RogueStoreProvider
}

module.exports = withStore