/* eslint-disable no-console */
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// TODO measure file sizes, improve logging, and other improvements

const { createBundlers, bundleApp } = require("../src/bundle");

console.log("Creating an optimized production build...");

createBundlers().then(({ clientBundler, serverBundler }) => {
  bundleApp(clientBundler, serverBundler);
});
