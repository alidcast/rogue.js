# Rogue

> The "nearly invisible" server-rendering framework for React applications

- [Introduction](#introduction)
- [Packages](#packages)

## Introduction

Rogue streamlines the process of creating server-rendered React applications.

We call Rogue a _nearly invisible_ library, because it doesn't require a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs); all you need, is the `App.js` component you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like.

We're able to give you back control of your application, because we leverage the elegance of [React Router](https://github.com/ReactTraining/react-router/) (for dynamic routing) and [Apollo Graphql](https://github.com/apollographql/apollo-client) (for querying data), which together dispense with the need to split your server-rendered routes into distinct entry points. With these tools, everything already happens on a per component basis, so we just handle the server-rendering setup for you.

As an added benefit, Rogue also comes with first-class support for: State Management (Redux) and CSS-in-JS (Emotion / Styled-Components).

But anyway, -- these are just words; and we know the way to your heart is with code, so here's an example of how your server-rendered apps will look going forward:

```js
// App.js
export default () => 'Hello World!'

// client.js
import { hydrate } from '@roguejs/app'
import App from './App'

hydrate(App)

// server.js
import Rogue from '@roguejs/app/server'
import App from './App'

const app = new Rogue(App)

app.listen(3000)
```

## Packages 

There are two Rogue packages: 

- [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app), holds the core modules for the Rogue library. You can use this package to streamline your SSR experience independent of any build setup.
- [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), holds
higher order components that come preconfigured with SSR support for Rogue. You can use this package to enhance your application without uncessary SSR boilerplate.

Each of the above packages holds its respective documentation inside its `README.md`.

The fastest way to get started with Rogue is with [Razzle](https://github.com/jaredpalmer/razzle) (an SSR build tool). Check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) example to see how to get started.

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## License

[MIT](/LICENSE.md)
