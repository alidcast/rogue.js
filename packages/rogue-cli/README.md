# roguejs/cli

Install it:

```bash
npm install --save rogue react react-dom react-router-dom
```

and add a script to your package.json:

```json
{
  "scripts": {
    "dev": "rogue dev",
    "build": "rogue build",
    "start": "rogue start"
  }
}
```

After that, your `src/App.js` is your main entry point. All you need is to do is export a basic component to get started:

```js
import React from "react"

export default () => <div>Welcome to Rogue.js!</div>
```

## Rogue Configuration

We want to remain as invisible as possible—so there's no special `rogue.config.js` file. The idea is that once you know the entry point of an application, the rest can be inferred from the code.

Right now, Rogue will look inside your root `./` and `src/` directory for an `App` entry point. Both `.js` and `.tsx` extensions are supported.

If you'd like to configure the entry point, just do what you'd normally do, change the `main` property in your `package.json`:

```
// package.json
{
  "main": "app/src/App"
}
```


## Build Techniques

### Environment Variables 

You'll often have to use secrets, or environment variables, in your application. This is done inside `.env` files, which Parcel has built-in support for.

For example, this configuration: 
```
// .env
API_URL='http://localhost:4000/graphql'
```

Can be accessed as:

```
process.env.API_URL 
```

You can also set varaibles based on your environment, as Parcel will also load the `.env` file with the suffix of your current `NODE_ENV`. So, in production, it will load `.env.production` (make sure to add this file to your `.gitignore`!)

### Path Resolution 

It's ugly and messy to have set long, relative paths like this: `../../../my-far-away-module`.

Parcel has built-in support for tide paths `~/` that resolve relative to your root directory. 

If you want a custom resolver, you can configure it inside the `alias` property in your `package.json`:

*note: this is coming soon (https://github.com/parcel-bundler/parcel/pull/1506)*

```json
alias: {
  "~/": "./src/app",
}
```

### Using with Typescript

Parcel has built-in support for Typescript. All you have to do is create a file with a `.ts` or `.tsx` extension and your code will automatically be compiled based on your `tsconfig.json` configuration.

Here are a few options we recommend you have:

```js
{
  "compilerOptions": {
    // preserve JSX so that babel can handle it and you can take advantage of plugin transformations
    "jsx": "preserve",
    // resolve your modules to esnext so that dynamic imports and code splitting can work
    "target": "esnext",
    "module": "esnext",
    // make sure you map the paths you configured with Parcel for autocompletion to work
    "baseUrl": "./src",
    "paths": {
      "~/*": ["*"]
    }
  }
}
```
