# Rogue

With Rogue, the server rendering configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs). All you need is the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like.

As an added benefit, Rogue also comes with first-class support for: GraphQL (Apollo), State Management (Redux), and Css-in-Js (Emotion / Styled-Components).

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

There are three Rogue packages: 

- [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app), holds the core modules for the Rogue framework. You can use this package to streamline your SSR experience independent of any build setup.
- [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), holds
higher order components that come preconfigured with SSR support for Rogue. You can use this package to enhance your application without uncessary SSR boilerplate.
- [`@roguejs/cli`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-cli) (WIP), holds the build and development system for the Roguejs framework. You can use this package to power a Roguejs app with zero configuration.

*If you'd like to get started with Rogue now, we recommend you use [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app) with your own custom build setup. Check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) example to get started.*

Each of the above packages holds its respective documentation inside its `README.md`.

### Who is Rogue for? 

Rogue was built to make complex web apps simpler. We're able to do this by assuming that you're already using (or plan to use) two great techologies: React Router 4 and Apollo Graphql. If your application doesn't satisfy these needs, we recommend you check out [Nextjs](https://github.com/zeit/next.js/) as an alternative.

### Index

- [Rogue Framework](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app)
  - [App Setup](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-setup)
  - [App Concepts](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-concepts)
    - [Server-rendering Logic](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#server-rendering-logic)
  - [App Enhacements](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-enhancements)
    - [Document Tags](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#document-tags)
    - [Code Splitting](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#document-tags)
  - [Custom Enhancements](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#custom-enhancements)
  - [Custom Server](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#custom-server)
- [Rogue Hocs](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs)
  - [CSS-in-JS](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#css-in-js)
  - [State Management](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#state-management)
  - [Apollo Graphql](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#apollo-graphql)

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## Liscense

[MIT](/LICENSE.md)
