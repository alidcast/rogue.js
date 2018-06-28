# Rogue

> SSR for React that's invisible (zero configuration!) and quick (no Webpack!)

🚧 Under active development 🚧

## Project Goals / Phisolophy 

With Rouge, the SSR configuration will be nearly invisible to you. You don't need a special `/pages` directory (like Nextjs) or a seperate `routes.js` file (like Afterjs). All you need is the `App.js` entry point you'd usually have. This means that you can wrap your app in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React's values, you can organize your code however you like. 

How come you don't need any upfront route configuration anymore? Since we assue you're using React Router 4 (why wouldn't you be!?), we can walk your component tree and know which routes to code split and server render. 

As an added benefit, because Rogue is a newer framework, we can use Parcel as our application bundler. One of the top complaints of existing SSR frameworks is slow build times, but they'll tell you it's not their fault, they rely on Webpack. Well, we don't! So not only to we avoid maintaining a complex build setup (Parcel is zero configuration too!), but you'll get faster build times and a better developer experience.

TLDR; Parcel + React + React Router 4 + App.js = SSR Heaven

- [Getting Started](#getting-started)
- [CSS-in-JS](#css-in-js)

## Getting Started

### Setup

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

## CSS-in-JS

Rogue has first class support for [emotion](https://emotion.sh) and [styled-components](https://styled-components.com).

```bash
npm install --save styled-components
// or
npm install --save emotion react-emotion emotion-theming
```

After that, all you have to do is import one of our style providers in your `App.js` file. 

Here's an example:

```js
import StylesProvider from 'rogue/providers/emotion'
// or 
import StylesProvider from 'rogue/providers/styled-components'

export default () => (
  <StylesProvider theme={theme}>
    <App />
  </StylesProvider>
)
```

The above `StyleProvider` is actually the same as the `ThemeProvider` you're chosen library providers, but we ask you to import it via our package since that's how we know for sure that you'd like us to SSR your styles. 