
## roguejs/app

Rogue comes with its own middleware framework that you can use to streamline your SSR setup.

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

### `rogue` API

* `rogue(args: Object)`

Accepts the following arguments:
* `Helmet`: (required) A `react-helmet` component.
* `App`: (required) Your app's root component.
* `bundleUrl`: The location where your bundle will be served from. Defaults to `./bundle.js`.

Has the following methods:

* `preuse(fn)`: `Function` to add a middleware before the render middleware.
* `use(fn)`: `Function` to add a middleware after the render middleware.
* `render(req, res)`: `Function` to run the rogue middleware stack against Node's `req` and `res` objects.