# Rogue

> The "nearly invisible" server-rendering framework for React applications

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Advanced Usage](#advanced-usage)
- [Packages](#packages)

## Introduction

Rogue streamlines the process of creating server-rendered React applications.

We call Rogue a _nearly invisible_ library, because it doesn't require a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs); all you need, is the `App.js` component you'd usually have. This means that, staying true to React's values, you can organize your code however you like.

We're able to give you back control of your application, because we leverage [React Router](https://github.com/ReactTraining/react-router/) (for dynamic routing) and [Apollo Graphql](https://github.com/apollographql/apollo-client) (for querying data), which together dispense with the need to split your server-rendered routes into distinct entry points. With these libraries, everything already happens on a per component basis, so we just handle the server-rendering setup for you.

## Getting Started

First, install the package: 

```
npm install @roguejs/app
```

In your `server.js` initialize your Rogue app by passing it your root App component and script to your client bundle: 

```js
import rogue from '@roguejs/app/server'
import App from './App'

const app = rouge(App, process.env.BUNDLE_URL)

app.listen(4000)
```

In your `client.js` hydrate your Rogue app:

```js
import hydrate from '@roguejs/app/client'
import App from './App'

hydrate(App)
```

And that's it! With just a few lines of code, you have a server rendered React application.

To get you're application running, we recommend an SSR build tool such as [razzle](https://github.com/jaredpalmer/razzle). Check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) example to see how to get started.

Rogue can also be used with [`react-native-web`](https://github.com/necolas/react-native-web/). If you're interested in this, check out the [with-react-native](https://github.com/alidcastano/rogue.js/tree/master/examples/with-react-native) example.

#### `rogue` API

* `rogue(App: React.Component, bundleUrl: string, options: Object)`

Accepts the following options:
* `renderToString(app, ctx)`: a custom metho for rendering app node to static markup.
* `headTags`: array of head tags to include in html document.
* `bodyTags`: array of body tags to include in html document.

Has the following methods:

* `preuse(fn)`: `Function` to add a middleware before the render middleware.
* `use(fn)`: `Function` to add a middleware after the render middleware.
* `render(req, res)`: `Function` to run the rogue middleware stack against Node's `req` and `res` objects.
* `listen(port, callback)`: `Function` to start the app listening for requests. Alias to Nodejs [`server.listen`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_server_listen_port_hostname_backlog_callback).

### Server-rendering logic

Any logic you'd like to handle upon server rendering can be done inside a component's `static getInitialProps` method (we kept the same property name as `Nextjs` to pay homage to the grandaddy of React SSR frameworks).

It's important to note that Rogue only calls `getInitialProps` inside your `App.js` component (and not inside `pages` like Nextjs).

The reason for that is that Rogue assumes you're using Apollo Graphql and React Router 4. So that elimates the two primary use-cases for `getInitialProps` inside pages: querying data and handling redirects.

Nonetheless, `getInitialProps` is still useful for bootstrapping your application with server specific logic. You can use it to configure SSR support for external libraries ([`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), or, another common scenario, is refreshing an authenticated user. Here's how that might look like:

```js
// note: this example uses our apollo and redux hocs
export default class App extends React.Component {
  static async getInitialProps({ req, res }) {
    const token = getToken(ctx.req)
    if (!ctx.store.getState().session.user) { // refresh session
      try {
        const res = await ctx.apollo.query({ query: authUserQuery })
        ctx.store.dispatch(setSession({ user: res.data.authUser }))
      } catch (err) { // invalid or expired token 
        ctx.store.dispatch(removeSession())
      }
    }
  }
}
```

If you return any value from `getInitialProps`, make sure that it is a plain `Object`, as it will be serialized when server rendering.

This data will then be passed to the component exported from your `App.js` file.

#### rogue `ctx` object

- `req`: (server-only) A nodejs Request object
- `res`: (server-only) A nodejs Response object
- `app`: (server-only) An object, with properties to configure SSR
  - `routable`: A function accpets a Component and returns it wrapped in router environment
  - `headTags`: An array of head tags to include in html document,
  - `bodyTags`: An array of body tags to include in html document,
- `isServer`: A boolean to indicate whether current environment is server
- `fullPath`: The full resolved URL including query and hash.
- `path`: A string that equals the path of the current route.
- `query`: An object that contains key/value pairs of the search string.

### Document Tags 

There are two ways to manage document tags: application side or server side. 

To manage document tags within your application, Rogue has automatic support for [react-helmet](https://github.com/nfl/react-helmet). Check out their documentation for usage, but here's a basic example: 

```js
import { Helmet } from 'react-helmet'

export default () => (
  <React.Fragment>
    <Helmet>
      <title>My Rogue App!</title>
    </Helmet>
    <App />
  </React.Fragment>
)
```

To manage document tags for server-logic, you can use Rogue's `ctx` object. Here's an example of how you might use Rogue's API to setup a CSS-in-JS library such as styled-components:

```js

const app = rouge(App, process.env.BUNDLE_URL, {
  renderToString(app, ctx) {
    const markup = ReactDOM.renderToString(app)

    const sheet = new ServerStyleSheet()
    sheet.collectStyles(app)
    ctx.app.headTags.push(sheet.getStyleTags())

    return markup
  }
})
```

## Advanced Usage

### Custom Server

You can use Rogue with your own custom server. Simply pass [`rogue.render`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#rogue-api) to your app's middleware:

```js
import Rogue from '@roguejs/app/server'
import express from 'express'
import App from './app/App'

const rogue = new Rogue(App)

const app = express()

app.use(rogue.render)

export default app
```

## Packages 

There are two Rogue packages: 

- [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app), holds the core modules for the Rogue library. You can use this package to streamline your SSR experience independent of any build setup.
- [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), holds
higher order components that come preconfigured with SSR support for Rogue. You can use this package to enhance your application without uncessary SSR boilerplate.

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## License

[MIT](/LICENSE.md)
