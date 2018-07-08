# Rogue

> SSR for React that's invisible (zero configuration!) and quick (no Webpack!)

🚧 Under construction 🚧

## Project Goals / Philosophy 

With Rogue, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs). All you need is the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like. 

How come you don't need any upfront route configuration anymore? Since we assume you're using React Router 4 (why wouldn't you be!?), we can [walk your component tree](#walking-your-app-tree) and use the same logic as your router to know which routes will be called so that we can handle SSR for them.

As an added benefit, because Rogue is a newer framework, we can use Parcel as our application bundler. One of the top complaints of existing SSR frameworks is slow build times, but they'll tell you it's not their fault, they rely on Webpack. Well, we don't! So not only to we avoid maintaining a complex build setup (Parcel is zero configuration too!), but you'll get faster build times and a better developer experience.

TLDR; React + React Router 4 + Parcel + App.js = SSR Heaven

**Table of Contents**

- [Getting Started](#getting-started)
- [Rogue Configuration](#rogue-configuration)
- [App Concepts](#core-concepts)
  - [Data Fetching and Middleware](#data-fetching-and-middleware)
    - [`getInitialProps`](#getinitialprops-ctx--data--void)
  - [Providers, Layouts, Pages, etc.](#providers-layouts-pages-etc)
    - [Walking your App tree](#walking-your-app-tree)
- [App Customization](#app-customization)
  - [Document Tags](#document-tags)
  - [Code Splitting](#code-splitting)
  - [CSS-in-JS](#css-in-js)
  - [State Management](#state-management)
  - [Apollo Graphql](#apollo-graphql)
- [Build Techniques](#build-recipes)
  - [Environment Variables](#environment-variables)
  - [Path Resolution](#path-resolution)
  - [Using with Typescript](#using-with-typescript)

## Getting Started

Install it:

```bash
npm install --save rogue react react-dom react-router-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "rogue dev",
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

## App Concepts 

### Data Fetching and Middleware

Any logic you'd like to handle on initial client and server rendering can be done inside a component's `static getInitialProps` method (we kept the same property name as `Nextjs` to pay homeage to the grandaddy of React SSR frameworks).

You can use this property to prefetch data:

```js
export default class App extends React.Component {
  static async getInitialProps({ req, res }) {
    const data = await callMyApi()
    return data
  }
}
```

Or to handle route middleware: 

```js
export default class Route extends React.Component {
  static getInitialProps({ req, res, redirect }) {
    if (req.url === '/not-allowed') redirect('/')
  }
}
```

Just make sure that if you do return any value from `getInitialProps`, that it is a plain `Object`, as it will be serialized when server rendering.

This data will then be passed to the component exported from your `App.js` file.

#### `getInitialProps: (ctx) => Data | void`

- req: (server-only) A Express.js request object
- res: (server-only) An Express.js response object
- redirect: A function to redirect user to another route.

### Providers, Layouts, Pages, etc. 

Remember that Rogue isn't asking you to configure any routes upfront. You just export a component from `App.js` component and make sure to use React Router 4 (RR4). We'll walk your component tree and use the same logic as your router to know which routes to server render.

So how do you handle Providers, Layouts, and Pages in your application with just an `App.js` file? That's the wonderful simplicity of Rogue: you're just using React, React Router 4,  and some optional `getInitialProps` magic.

Let us briefly explain how we server render your application so that you can better understand how to handle this yourself.

#### Walking your App tree

Starting from the component exported from your `App.js`, Rogue will walk your component tree looking for any components with a `static getInitialProps` method. It'll load these components in the order they are declared.

Most applications are usually organized in this order: 

```
Providers (e.g. ApolloProvider, StyleProvider) -> Layouts (e.g. AppLayout, AuthLayout) -> Pages (e.g. Dashboard, Login, Register)
```

`Providers` are regular components with an optional `getInitialProps` method. For examples of this check out [App Customization](#app-customization) section or the code found inside the `rogue/hocs` directory.

`Layouts` and `Pages` on the other hand, are more properly thought of as "routes," that also can optionally have a `getInitialProps` method. For Rogue, the only difference between the two is that one comes before the other. 

This is the important part to remember: since you can only server render routes exclusively (e.g. you match `/route1` or `/route2`, not both), Rogue expects you to configure your Layouts and Pages in that manner. The way you do that is with a RR4's [Switch component](https://reacttraining.com/react-router/web/api/Switch).

Here's an example:

```js
// App.js
import { Switch, Route } from 'react-router-dom'

export default () => (
  <Provider>
    <Switch>
      // Route with only a Page
      <Route exact path="/welcome" component={WelcomePage} />
      // Routes with a  Layout and a Page, via render props 
      <Route exact path="/register" render={props => <AuthLayout><Register {...props}></AuthLayout>} />
      <Route exact path="/login" render={props => <AuthLayout><Login {...props}></AuthLayout>} />
      // Route with a Layout and a Page, via a nested switch statement
      <Route path="/" render={props => {
        <AppLayout>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/profile" component={Profile} />
          </Switch>
        </AppLayout>} 
      }/>
    </Switch>
  </Provider>
)
```

So how does Rogue prevent itself from walking your entire App.js tree? After we find your first switch block (i.e. an exclusively rendered Page), we'll continue walking until we find five consecutive components without an `getInitialProps` method. We found this heuristic to work extremely well—there's no reason why you wouldn't have at least one `Switch` block (this isn't a SPA mate), or need to nest a servable component more than five levels apart. And the tiny performance cost of walking your component tree is well worth the simplicity it buys your application.

## Rogue Configuration

We want to remain as invisible as possible—so there's no special `rogue.config.js` file. The idea is that once you know the entry point of an application, the rest can be inferred from the code.

Right now, Rogue will look inside your root `./` and `src/` directory for an `App` entry point. Both `.js` and `.tsx` extensions are supported.

If you'd like to configure the entry point, just do what you'd normally do, change the `main` property in your `package.json`:

```
// package.json
{
  "main": "app/src/App"
}
```

## App Customization

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

### Code Splitting

Rogue has automatic support for code splitting via [loadable-components](https://github.com/smooth-code/loadable-components). 

All you have to do is configure your babel to handle the code split files:

```json
// .babelrc
{
  "plugins": [
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

### CSS-in-JS

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

*In this case, our `StyleProvider` just wraps each respective packages `ThemeProvider`. Initializing it with your theme is optional but you must still import the appropriate `hoc` as that's how you tell us to configure SSR support for it.*

That's it; now you have SSR support for your styles, so style away!


### State management

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

### Apollo Graphql

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

## Build Techniques

### Environment Variables 

You'll often have to use secrets, or environment variables, in your application. This is done inside `.env` files, which Parcel has built-in support for.

For example, this configuration: 
```
// .env
API_URL='http://localhost:4000/graphql'
```

Can be accessed as:

```
process.env.API_URL 
```

You can also set varaibles based on your environment, as Parcel will also load the `.env` file with the suffix of your current `NODE_ENV`. So, in production, it will load `.env.production` (make sure to add this file to your `.gitignore`!)

### Path Resolution 

It's ugly and messy to have set long, relative paths like this: `../../../my-far-away-module`.

Parcel has built-in support for tide paths `~/` that resolve relative to your root directory. 

If you want a custom resolver, you can configure it inside the `alias` property in your `package.json`:

*note: this is coming soon (https://github.com/parcel-bundler/parcel/pull/1506)*

```json
alias: {
  "~/": "./src/app",
}
```

### Using with Typescript

Parcel has built-in support for Typescript. All you have to do is create a file with a `.ts` or `.tsx` extension and your code will automatically be compiled based on your `tsconfig.json` configuration.

Here are a few options we recommend you have:

```js
{
  "compilerOptions": {
    // preserve JSX so that babel can handle it and you can take advantage of plugin transformations
    "jsx": "preserve",
    // resolve your modules to esnext so that dynamic imports and code splitting can work
    "target": "esnext",
    "module": "esnext",
    // make sure you map the paths you configured with Parcel for autocompletion to work
    "baseUrl": "./src",
    "paths": {
      "~/*": ["*"]
    }
  }
}
```

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration 

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## Liscense

[MIT](/LICENSE.md)
