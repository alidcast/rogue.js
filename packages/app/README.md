# roguejs/app

- [App Setup](#app-setup)
- [App Concepts](#app-concepts)
  - [Server-rendering logic](#packages/rogue-app#server-rendering-logic)
    - [`getInitialProps`](#getinitialprops-ctx--data--void)
- [App Enhancements](#app-enhancements)
  - [Document Tags](#document-tags)
- [Custom Enhancements](#custom-enhancements)
- [Custom Server](#custom-server)

## App Setup

Rogue comes with a lightweight middleware framework that you can use to streamline your server-rendering setup.

First, install the package: 

```
npm install @roguejs/app
```

In your `server.js` initialize your Rogue app by passing it your root App component and script to your client bundle: 

```js
import rogue from '@roguejs/app/server'
import App from './App'

const app = rouge(App, process.env.BUNDLE_URL)

export default app
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

## `rogue` API

* `rogue(App: React.Component, options: Object)`

Accepts the following options:
* `headTags`: array of head tags to include in html document.
* `bodyTags`: array of body tags to include in html document.

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

However, `getInitialProps` is still useful for bootstrapping your application with server specific logic. For example, here's how you might handle refreshing an authenticated user:

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
- `isServer`: A boolean to indicate whether current environment is server
- `fullPath`: The full resolved URL including query and hash.
- `path`: A string that equals the path of the current route, e.g. `"/foo/bar"`.
- `query`: An object that contains key/value pairs of the query string. For example, if the path is `/foo?user=1`, then `ctx.query.user == 1`. If there is no query the value will be an empty object.

## App Enhancements

Rogue makes it easy to enhance your app with ssr compatible functionality.

The only enhancement that comes built-in to Rogue is [document tag management](#document-tags). For common customizations such as state management and CSS-in-JS, we made support optional via higher-order components, or hocs. You can find more information about these hocs in our [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs). 

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
