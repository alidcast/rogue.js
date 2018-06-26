# Rogue

> SSR for React that's quick and invisible

## Comparison with other frameworks

- **Routing**: Both Roguejs and Razzle+Afterjs use React Router 4. Nextjs plans to switch to it in the future.
- **SSR source of truth**: Unlike Nextjs that uses your `/pages` directory and Afterjs that uses your `route.js` file, Rougejs uses your `App.js` file as an entry point to find which pages to server render. This means that you can wrap your pages in layouts/transitions/providers, etc. the same way you would in a regular React Application, and staying true to React values, can organize your code however you like.
**Bunlder**: Nextjs and Razzle+Afterjs have been around longer so they use Webpack. We're new, so we were able choose Parcel as our application bundler. This mean faster build times and a better development experience.

## Getting Started With Rogue

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

After that, you're `src/App.js` is your main entry point. All you need is to do is export a basic component to get started:

```
export default () => <div>Welcome to Rogue.js!</div>

```

Then just run `npm run dev` and go to `http://localhost:3000`


