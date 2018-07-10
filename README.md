# Rogue

With Rogue, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs). Only the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like.

As an added benefit, Rogue also comes with first-class support for: GraphQL (Apollo), State Management (Redux), and Css-in-Js (Emotion / Styled-Components).

🚧 Under Construction 🚧

*If you'd like to get started with Rogue now, we recommend you use [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app) (see below) with your own custom build setup. Check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) directory for an example of how to setup Rogue.*

There are three Rogue packages: 

- [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app), holds the core modules for the Rogue framework. You can use this package to streamline your SSR experience independent of any build setup.
- [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), holds
higher order components that come preconfigured with SSR support for Rogue. You can use this package to enhance your application without uncessary SSR boilerplate.
- [`@roguejs/cli`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-cli) (WIP), holds the build and development system for the Roguejs framework. You can use this package to power a Roguejs app with zero configuration.

Each of the above packages holds its respective documentation inside its `README.md`.

### Table of Contents

- [Rogue Framework](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app)
  - [App Setup](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-setup)
  - [App Concepts](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-concepts)
    - [Data Fetching and Middleware](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#data-fetching-and-middleware)
    - [Providers, Layouts, Pages, etc.](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#providers-layouts-pages-etc)
  - [App Enhacements](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#app-enhancements)
    - [Document Tags](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#document-tags)
    - [Code Splitting](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#document-tags)
- [Rogue Hocs](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs)
  - [CSS-in-JS](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#css-in-js)
  - [State Management](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#state-management)
  - [Apollo Graphql](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs#apollo-graphql)

### FAQ

#### How come you don't need any upfront route configuration anymore?

Since we assume you're using React Router 4 (why wouldn't you be?!), we can walk your component tree and use the same logic as your router to know which routes will be called so that we can handle SSR for them.

Read the docs on [walking your `App.js` tree](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app#walking-your-app-tree) for an in-depth explanation.

#### Will Rogue support static pages like `Gatsbyjs` or `Nextjs`?

Rogue was created to make complex apps simpler. We leverage RR4 so that we can infer from your code what routes to dynamically SSR without any configuration. However, if you only need static pages, then Nextjs and Gatsby are great solutions, and having a `/pages` directory might even fit your use-case better.

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## Liscense

[MIT](/LICENSE.md)
