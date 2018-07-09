# Rogue

With Rogue, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a separate `routes.js` file (like Afterjs). Only the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like. 

There are three Rogue packages: 

- [`@roguejs/app`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-app), which holds the core modules for the Rogue framework. You can use this package to streamline your SSR experience independent of any build setup.
- [`@roguejs/hocs`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-hocs), which holds
higher order components that come preconfigured with SSR support Rogue. You can use this package to customize your application without uncessary SSR boilerplate.
- [`@roguejs/cli`](https://github.com/alidcastano/rogue.js/tree/master/packages/rogue-cli) (WIP), which holds the build and development system for the Roguejs framework. You can use this package to power a Roguejs app with a nearly invisible configuration.

*Note: If you'd like to get started with Rogue now, we recommend you use `@roguejs/app` with your own custom build setup. Check out the [with-razzle](https://github.com/alidcastano/rogue.js/tree/master/examples/with-razzle) directory for an example of how to setup Rogue.*

Each of the above packages holds its respective documentation inside its `README.md`. 

**Table of Contents**

- [Getting Started](#getting-started)
- [Rogue Configuration](#rogue-configuration)
- [App Concepts](#core-concepts)
  - [Data Fetching and Middleware](#packages/rogue-app#data-fetching-and-middleware)
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

## Author

- Alid Castano ([@alidcastano](https://twitter.com/alidcastano))

## Inspiration 

- [Nextjs](https://github.com/zeit/next.js/)
- [Razzle](https://github.com/jaredpalmer/razzle)+[Afterjs](https://github.com/jaredpalmer/after.js)
- [Vue](https://github.com/vuejs/vue)/[Nuxtjs](https://github.com/nuxt/nuxt.js)

## Liscense

[MIT](/LICENSE.md)
