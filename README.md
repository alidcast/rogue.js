# Rogue

> SSR for React that's invisible (zero configuration!) and quick (no Webpack!)

🚧 Under active development 🚧

## Project Goals / Phisolophy 

With Rogue, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a seperate `routes.js` file (like Afterjs). All you need is the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like. 

How come you don't need any upfront route configuration anymore? Since we assue you're using React Router 4 (why wouldn't you be!?), we can walk your component tree and know which routes to code split and server render. 

As an added benefit, because Rogue is a newer framework, we can use Parcel as our application bundler. One of the top complaints of existing SSR frameworks is slow build times, but they'll tell you it's not their fault, they rely on Webpack. Well, we don't! So not only to we avoid maintaining a complex build setup (Parcel is zero configuration too!), but you'll get faster build times and a better developer experience.

TLDR; Parcel + React + React Router 4 + App.js = SSR Heaven

**Table of Contents**

- [Getting Started](#getting-started)
- [App Configuration](#app-configuration)
  - [Code Splitting](#code-splitting)
  - [CSS-in-JS](#css-in-js)

# Getting Started

Install it:

```bash
npm install --save rogue react react-dom react-router-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "rogue",
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

# App Configuration 

You can configure your app inside the `rogue.config.js` file. Below are the list of enhances we provide for you.

## Code Splitting

Rogue has built in support for code splitting via [loadable-components](https://github.com/smooth-code/loadable-components). We chose it because, aside from preferring its API, it didn't require Webpack to work unlike the other solutions.

Here's an example of how code splitting would work:

```js
import { Route } from 'react-router'
import * as Routes from './Routes'
import loadable from 'loadable-components' // this is the important part

export const Dashboard = loadable(() => import('./Dashboard'))
export const Landing = loadable(() => import('./Landing'))

export default () => (
  <Switch>
    <Route exact path="/" component={Dashboard} />
     <Route path="/welcome" component={Landing} />
  </Switch>
)
```

Make sure to check out the `loadable-components` documentation for the full API.

Also, if for some reason you'd like to disable code splitting with `loadable-components`, add `loadable: false` to your `rogue.config.js`.

## CSS-in-JS

Rogue has first class support for [emotion](https://emotion.sh) and [styled-components](https://styled-components.com).

First, install your chosen library: 

```bash
npm install --save styled-components
// or
npm install --save emotion react-emotion emotion-theming emotion-server
```

Then, specify specific library in the `css` option inside `rogue.config.js`.

For example: 

```js
// rogue.config.js
module.exports = {
  css: 'emotion'
  // or 
  css: 'styled-components'
}
```

That's it; now you have SSR support for your styles, so style away!