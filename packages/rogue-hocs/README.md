# @roguejs/hocs

Below are optional app customizations that we have SSR support for.

All you have to do is import and initialize the desired hoc in your `App.js` file.

*Note: Make sure to read the respective packages documentation for usage information.*

**Table of Contents**
- [CSS-in-JS](#css-in-js)
- [State Management](#state-management)
- [Apollo Graphql](#apollo-graphql)

## CSS-in-JS

Rogue has first class support for [emotion](https://emotion.sh) and [styled-components](https://styled-components.com).

First, install your chosen library: 

```bash
npm install --save styled-components
// or
npm install --save emotion react-emotion emotion-theming emotion-server
```

Then import the `hoc` for your chosen package in your `App.js` file:

For example: 

```js
import withStyles from 'rogue/hocs/emotion'
// or
import withStyles from 'rogue/hocs/styled-components'
import { theme } from './styles/' // optional

const App = () => (...) 

export default withStyles(theme)(App)
```

That's it; now you have SSR support for your styles, so style away!

## State management

Rogue has optional support for [redux](https://github.com/reduxjs/redux).

First install it: 

```bash
npm install --save redux react-redux
```

Then, you must write a function for creating your store. You will pass this function to the redux hoc that we provide for you and we will call it with the `initialState` from SRR. Here's an example:

```js
import { createStore as createReduxStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'

export default function createStore (initialState) {
  const reducers = combineReducers({ ... add your reducers here ... })
  const enhancers = composeWithDevTools(applyMiddleware(thunkMiddleware))
  return createReduxStore(
    reducers, 
    initialState, 
    enhancers
  )
}
```

Lastly, import and initialize our Redux hoc in your `App.js` file:

```js
import withStore from 'rogue/hocs/redux'
import createStore from './store'

const App = () => (...)

export default withStore(createStore)(App)
```

## Apollo Graphql

Rogue has optional support for [react-apollo](https://github.com/apollographql/react-apollo).

First install it: 

```bash
npm install --save apollo react-apollo
```

Then, you must write a function for creating your apollo client. You will pass this function to the apollo hoc that we provide for you and we will call it with the `initialState` from SRR and a `ctx` object if called from the server. Here's an example:


```js
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { isServer } from 'rogue'

export default function createClient(initialState, ctx) {
  return new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    connectToDevTools: !isServer,
    ssrMode: isServer, // Disables forceFetch on the server (so queries are only run once)
    cache: new InMemoryCache().restore(initialState || {})
  })
}
```

Lastly, import and initialize our Apollo hoc in your `App.js` file:

```js
import withApollo from 'rogue/hocs/apollo'
import createClient from './apollo'

const App = () => (...)

export default withApollo(createClient)(App)
```

Important: If you're using other hocs in your `App.js`, make sure that Apollo is the top most one that you include. 

For example: 

```js
import { compose } from 'recompose'

const App = () => (...)

export default compose(
  withApollo(createClient),
  withStore(createStore),
  withStyles(theme)
)(App)
```
