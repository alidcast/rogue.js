/* eslint-disable no-console */
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const http = require("http");

const { createBundlers, bundleApp } = require("../src/bundle");
const { requireUncached } = require("../src/bundle/utils");
const { BUILD_PATH } = require("../src/bundle/constants");

const port = process.env.PORT || 3000;

createBundlers().then(({ clientBundler, serverBundler }) => {
  let server;
  let currentApp = null;

  const getApp = () => requireUncached(BUILD_PATH).default;

  const serveApp = () => {
    const app = getApp();
    currentApp = app;
    server = http.createServer(app);
    server.listen(port, error => {
      if (error) console.log(error);
      console.log(`🚀  Development server started in port ${port}`);
    });
  };

  const restartApp = async () => {
    if (!currentApp) return; // initial bundle

    // Watch mode is disabled for client so we handle rebundling it ourselves
    console.log("Rebuilding client...");
    await clientBundler.bundle();

    console.log("🔁  HMR Reloading server...");
    server.removeListener("request", currentApp);
    const newApp = getApp();
    currentApp = newApp;
    server.on("request", newApp);
  };

  serverBundler.on("bundled", restartApp);

  bundleApp(clientBundler, serverBundler).then(() => {
    console.log("Starting App...");
    serveApp();
  });
});
