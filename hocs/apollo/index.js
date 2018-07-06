/* eslint-disable no-console, global-require */
const { createElement: h } = require("react");
const { ApolloProvider, getDataFromTree } = require("react-apollo");
const { isServer } = require("../../index");

const APOLLO_CTX = "apollo";

// Polyfill fetch() on the server (used by apollo-client)
if (isServer) {
  global.fetch = require("isomorphic-unfetch");
}

async function initCache(App) {
  try {
    await getDataFromTree(App);
  } catch (error) {
    // Prevent Apollo Client GraphQL errors from crashing SSR.
    // Handle them in components via the data.error prop:
    // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
    console.error("Error while running `getDataFromTree`", error);
  }
}

/*
* Apollo Hoc to configure graphql client for server side rendering.
*
* Should be used as follows: 
*     withApollo(createClient)(App)
*
* The 'createClient' function will be passed the 'initialState' and, if called from server, a 'ctx' param.
*/
const withApollo = createClient => App => {
  let apolloClient = null;
  function getOrCreateClient(initialState = {}, ctx = {}) {
    // Always make new client in server, otherwise state is share between requests
    if (isServer) return createClient(initialState, ctx);

    if (!apolloClient) {
      apolloClient = createClient(initialState, ctx);
    }
    return apolloClient;
  }

  function RogueApolloProvider(props) {
    const client = getOrCreateClient(props.initialApolloState || {});
    return h(ApolloProvider, { client }, h(App, props));
  }

  RogueApolloProvider.getInitialProps = async ctx => {
    const client = createClient({}, ctx);
    ctx[APOLLO_CTX] = client; // provide client to app context
    if (isServer) await initCache(App);
    return { initialApolloState: client.cache.extract() };
  };

  return RogueApolloProvider;
};

module.exports = withApollo;
