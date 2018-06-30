# Rogue

> SSR for React that's invisible (zero configuration!) and quick (no Webpack!)

🚧 Under active development 🚧

## Project Goals / Phisolophy 

With Rogue, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a seperate `routes.js` file (like Afterjs). All you need is the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like. 

How come you don't need any upfront route configuration anymore? Since we assue you're using React Router 4 (why wouldn't you be!?), we can walk your component tree and use the same logic as your router to know which routes will be called so that we can handle SSR for them.

As an added benefit, because Rogue is a newer framework, we can use Parcel as our application bundler. One of the top complaints of existing SSR frameworks is slow build times, but they'll tell you it's not their fault, they rely on Webpack. Well, we don't! So not only to we avoid maintaining a complex build setup (Parcel is zero configuration too!), but you'll get faster build times and a better developer experience.

TLDR; React + React Router 4 + Parcel + App.js = SSR Heaven

**Table of Contents**

- [Getting Started](#getting-started)
- [Rogue Configuration](#rogue-configuration)
- [App Customization](#app-customization)
  - [Document Tags](#document-tags)
  - [Code Splitting](#code-splitting)
  - [CSS-in-JS](#css-in-js)
  - [State Management](#state-management)
  - [Apollo Graphql](#apollo-graphql)

# Getting Started

Install it:

```bash
npm install --save rogue react react-dom react-router-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "rogue",
    "build": "rogue build",
    "start": "rogue start"
  }
}
```

After that, your `src/App.js` is your main entry point. All you need is to do is export a basic component to get started:

```js
export default () => <div>Welcome to Rogue.js!</div>
```

Then just run `npm run dev` and go to `http://localhost:3000`

# Rogue Configuration

We want to remain as invisible as possible—so there's no special `rogue.config.js` file. The idea is that once you know the entry point of an application, the rest can be inferred from the code.

Right now, Rogue will look inside your root `./` and `src/` directory for an `App` entry point. Both `.js` and `.tsx` extensions are supported.

If you'd like to configure the entry point, just do what you'd normally do, change the `main` property in your `package.json`:

```
// package.json
{
  "main": "app/src/App"
}
```

# App Customization

Below are some app customizations that we have SSR support for. 

For some customizations, if the community already preferred a certain solution or if support for other options just wouldn't have worked (e.g. because it required Webpack), then we made support for them automatic. 

However, for customizations such as state management and CSS-in-JS, where the community is divided on which solution to use, then we made support optional via higher-order components, or hocs. All these hocs are found in our `rogue/hocs` directory. All you have to do is import and initialize them in your `App.js` file.

*Note: Make sure to read the respective packages documentation for usage information.*

## Document Tags 

Rogue has automatic support for [react-helmet](https://github.com/nfl/react-helmet) so that you can manage your document tags (`title`, `link`, `script` etc.) from anywhere in your component tree.

Check out their documentation for usage, but here's a basic example: 

```js
import { Helmet } from 'react-helmet'

export default () => (
  <React.Fragment>
    <Helmet>
      <title> My Amazing App! </title>
    </Helmet>
    <MyAmazingApp />
  </React.Fragment>
)
```

## Code Splitting

Rogue has automatic support for code splitting via [loadable-components](https://github.com/smooth-code/loadable-components). 

All you have to do is configure your `.babelrc` to handle the code split files:

```
{
  plugins: [
    "dynamic-import-node",
    "loadable-components/babel"
  ]
}
```

Now you can code split anywhere in your application. Here's an example:

```js
import { Route } from 'react-router'
import loadable from 'loadable-components'

export const Dashboard = loadable(() => import('./Dashboard'))
export const Landing = loadable(() => import('./Landing'))

export default () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
    <Route path="/welcome" component={Landing} />
  </Switch>
)
```

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
import theme from 'styles/theme' // optional

const App = () => (...) 

export default withStyles(theme)(App)
```

*In this case, our `StyleProvider` just wraps each respective packages `ThemeProvider`. Initializing it with your theme is optional but you must still import the appropriate `hoc` as that's how you tell us to configure SSR support for it.*

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
import createStore from './core/createStore'

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
import createClient from './core/createClient'

const App = () => (...)

export default withApollo(createClient)(App)
```

Important: If you're using other hocs in your `App.js`, make sure that Apollo is the top most one that you include. 

For example: 

```js
import { compose } from 'recompose'

export default compose(
  withApollo(createClient),
  withStore(createStore),
  withStyles(theme)
)
```