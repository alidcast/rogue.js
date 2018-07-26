# roguejs/app

- [App Setup](#app-setup)
- [App Concepts](#app-concepts)
  - [Server-rendering logic](#packages/rogue-app#server-rendering-logic)
    - [`getInitialProps`](#getinitialprops-ctx--data--void)
- [App Enhancements](#app-enhancements)
  - [Document Tags](#document-tags)
  - [Code Splitting](#code-splitting)
- [Custom Enhancements](#custom-enhancements)
- [Custom Server](#custom-server)

## App Setup

Rogue comes with a lightweight middleware framework that you can use to streamline your server-rendering setup.

First, install the package: 

```
npm install @roguejs/app
```

In your `server.js` initialize your Rogue app: 

```js
import Rogue from '@roguejs/app/server'
import { Helmet } from 'react-helmet'
import serveStatic from 'serve-static'
import App from './App'

const rogue = new Rogue(App)

rogue.preuse(serveStatic(process.env.PUBLIC_DIR))

export default rogue
```

In your `client.js` hydrate your Rogue app:

```js
import hydrate from '@roguejs/app/client'
import App from './App'

hydrate(App)
```

And finally, start your app: 

```js
import http from 'http'
import rogue from './server'

const server = http.createServer(rogue.render)

server.listen(3000)
```

Rogue doesn't impose any contraints in your applications structure, but we do recommend you take advantage of this fact by making your code it as modular as possible. Here's an example:

```
/src
  / components # app wide components 
  / layouts # page layouts, each one with its own nested components
    / App
      / Navigation
      index.js # entry point for App layout (can be imported as src/layouts/App)
    / Auth 
  /pages # app routes, each one with its own nested routes and components
    /Dashboard 
      / NewsFeed
      / Profile 
      index.js # entry point for Dashboard page (can be imported as src/pages/Dashboard)
    / Login
    / Register
  / store # app wide state
  / utils # app wide utils 
  App.js # your universal application
```

## `rogue` API

* `rogue(App: React.Component, options: Object)`

Accepts the following options:
* `bundleUrl`: The location where your bundle will be served from. Defaults to `./bundle.js`.

Has the following methods:

* `preuse(fn)`: `Function` to add a middleware before the render middleware.
* `use(fn)`: `Function` to add a middleware after the render middleware.
* `render(req, res)`: `Function` to run the rogue middleware stack against Node's `req` and `res` objects.
* `listen(port, callback)`: `Function` to start the app listening for requests. Alias to Nodejs [`server.listen`](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_server_listen_port_hostname_backlog_callback).

## App Concepts 

### Server-rendering logic

Any logic you'd like to handle upon server rendering can be done inside a component's `static getInitialProps` method (we kept the same property name as `Nextjs` to pay homage to the grandaddy of React SSR frameworks).

It's important to note that Rogue only calls `getInitialProps` inside your `App.js` component (and not inside `pages` like Nextjs).

The reason for that is that Rogue assumes you're using Apollo Graphql and React Router 4. So that elimates the two primary use-cases for `getInitialProps` inside pages: querying data and handling redirects.

However, `getInitialProps` is still useful for bootstrapping your application with server specific. For example, here's how you might handle refreshing an authenticated user:

```js
// note: this example uses the Apollo and Redux Hocs
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

#### `getInitialProps: (ctx) => Data | void`

- `req`: (server-only) A nodejs Request object
- `res`: (server-only) A nodejs Response object
- `app`: (server-only) An object, with properties to configure SSR
  - `routable`: A function accpets a Component and returns it wrapped in router environment
  - `headTags`: An array of head tags to include in html document,
  - `bodyTags`: An array of body tags to include in html document,
  - `markupRenderers`: An array of functions for further processing html markup
- `redirect`: A function to redirect user to another route
- `isServer`: A boolean to indicate whether current environment is server
- `path`: A string that equals the path of the current route, e.g. `"/foo/bar"`.
- `params`: (route only) An object that contains key/value pairs of dynamic route segments. For example, dynamic route path `"foo/:user"` can be accessed as `params.user`. If there are no params the value will be an empty object.
- `query`: An object that contains key/value pairs of the query string. For example, for a path `/foo?user=1`, we get `$route.query.user == 1`. If there is no query the value will be an empty object.
- `hash`: The hash of the current route (with the `#`), if it has one. If no hash is present the value will be an empty string.
- `fullPath`: The full resolved URL including query and hash.

## App Enhancements

Rogue makes it easy to enhance your app with functionality.

For some enhancements, if the community already preferred a certain solution or if support for other options just wouldn't have worked (e.g. because it required Webpack), then we made support for them automatic and included them below.

However, for customizations such as state management and CSS-in-JS, where the community is divided on which solution to use, then we made support optional via higher-order components, or hocs. You can find more information about these hocs in our [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs). 

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

## Custom Enhancements

With Rogue, you can configure SSR support for any React Provider by using the [`ctx.app`](#getinitialprops-ctx--data--void) object passed to `getInitialProps`.

As an example, here's how we configure SSR for or [`emotion` hoc](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs/emotion):

```js
RogueEmotionProvider.getInitialProps = (ctx) => {
  ctx.app.markupRenderers.push(
    markup => require('emotion-server').renderStylesToString(markup)
  )

  let props = {}
  if (App.getInitialProps) props = await App.getInitialProps(ctx) || {}
  return props
}
```

And here's how we do it for our [`styled-components` hoc](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs/styled-components):

```js
RogueStyledProvider.getInitialProps = (ctx) => {
  const sheet = new ServerStyleSheet()
  sheet.collectStyles(ctx.app.Component)
  ctx.app.headTags.push(sheet.getStyleTags())
  
  let props = {}
  if (App.getInitialProps) props = await App.getInitialProps(ctx) || {}
  return props
}
```

## Custom Server

You can use Rogue with your own custom server. Simply pass [`rogue.render`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#rogue-api) to your app's middleware:

```js
import Rogue from '@roguejs/app/server'
import express from 'express'
import App from './app/App'

const rogue = new Rogue(App)

const app = express()

app.use(app.static(process.env.PUBLIC_DIR))

app.use(rogue.render)

export default app
```
