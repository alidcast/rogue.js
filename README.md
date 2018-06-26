# Rogue

> SSR for React that's quick and invisible

I really, really didn't want to create "another SSR framework for React". Trust me, I hate maintaing code, and Next.js and Razzle+After.js are great solutions. So how'd we get here? Let me tell you my story:

  - I'm coming from Vue/Nuxt, and have that as an expectation for my SSR experience.
  - Next.js leaves dynamic routing up to the community. But routing is the backbone of an application and I hated feeling like my routing was hacked together, specially knowing the React Router 4 (RR4) existed. (RR4 and CSS-in-js was what convinced me to try out React!)
  - So I switched to Razzle/After.js, but then realized there wasn't support for Page layouts or transitions. Even in Next.js, which exposes an `_app.js` for this, it felt like a big hack. And once again, it was left up to the community to get this to work.
  - I asked myself: why does SSR have to be any different than a regular React application? Do server rendered routes have to be configured upfront (i.e. by a file-system or a seperate `routes.js`)?
  - If you've used Apollo Graphql with SSR, maybe you've used their `getDataFromTree` method. They're not asking you to configure your SSR data upfront, they're walking your React component tree to find it! Why can't we do the same for routes?! -- That's how the first part of Roguejs arose.
  - Still, I didn't want to created a framework. It looks like a lot of work. And, like I said above, I hate maintain code. But you know what I hate more than that? Slow build times. With Nuxt, since it's a bigger framework, my application took soo long to build. With Next.js it's the same. You go to issues asking why and they say they can't do much about it, it's Webpack's fault. Jesus.
  - Does a faster solution exist? Yes, Parcel! And it's zero config! Most of the heavy lifting of Nuxt/Next/Razzle is configuring your dev environment. This basically makes my job easier.
  - So, that's why I decided to make Rouge, to take advantage of Parcel's quick build times and a zero upfront configuration. With this, you can use React just as you normally would. The SSR experience is invisible to you.

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


