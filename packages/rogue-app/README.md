# roguejs/app

Then run `npm run dev` and go to `http://localhost:3000`

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

Make sure that if you do return any value from `getInitialProps`, that it is a plain `Object`, as it will be serialized when server rendering.

This data will then be passed to the component exported from your `App.js` file.

#### `getInitialProps: (ctx) => Data | void`

- req: (server-only) A Express.js request object
- res: (server-only) An Express.js response object
- redirect: A function to redirect user to another route.

### Providers, Layouts, Pages, etc. 

Remember that Rogue isn't asking you to configure any routes upfront. You export a component from `App.js` component and make sure to use React Router 4 (RR4). We'll walk your component tree and use the same logic as your router to know which routes to server render.

How do you handle Providers, Layouts, and Pages in your application with just an `App.js` file? That's the wonderful simplicity of Rogue: you're just using React, React Router 4,  and some optional `getInitialProps` magic.

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

How does Rogue prevent itself from walking your entire App.js tree? After we find your first switch block (i.e. an exclusively rendered Page), we'll continue walking until we find five consecutive components without an `getInitialProps` method. We found this heuristic to work extremely well—there's no reason why you wouldn't have at least one `Switch` block (this isn't a SPA mate), or need to nest a servable component more than five levels apart. And the tiny performance cost of walking your component tree is well worth the simplicity it buys your application.

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

## Setup

Rogue comes with a lightweight middleware framework that you can use to streamline your SSR setup.

First, install the package: 

```
npm install @roguejs/app
```

In your `server.js` initialize your Rogue app: 

```js
import Rogue from '@roguejs/app/server'
import { Helmet } from 'react-helmet'
import serveStatic from 'serve-static'
import App from './app/App'

const rogue = new Rogue({
  Helmet,
  App
})

rogue.preuse(serveStatic(process.env.PUBLIC_DIR))

export default rogue
```

In your `client.js` hyrate your Rogue app:

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

For an example of setting up Rogue with your own build system, check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) example.

You can also use Rogue in your own custom server:

```js
import Rogue from '@roguejs/app/server'
import express from 'express'

const app = express()
const rogue = new Rogue({...})

// Give rogue middleware to express
app.use(rogue.render)

export default app
```


## `rogue` API

* `rogue(args: Object)`

Accepts the following arguments:
* `Helmet`: (required) A `react-helmet` component.
* `App`: (required) Your app's root component.
* `bundleUrl`: The location where your bundle will be served from. Defaults to `./bundle.js`.

Has the following methods:

* `preuse(fn)`: `Function` to add a middleware before the render middleware.
* `use(fn)`: `Function` to add a middleware after the render middleware.
* `render(req, res)`: `Function` to run the rogue middleware stack against Node's `req` and `res` objects.