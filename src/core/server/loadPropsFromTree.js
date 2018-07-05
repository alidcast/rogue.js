const React = require("react");
const walkTree = require("react-tree-walker");
const { matchPath } = require("react-router-dom");
const { parse: parseUrl } = require("url");

const isSimpleElement = el => !el.type;

const isSwitch = el => el.type && el.type.name === "Switch";

const isServable = el =>
  el.type && typeof el.type.getInitialProps === "function";

const getRouteProps = el => {
  const { path: pathProp, exact, strict, sensitive, from } = el.props;
  const path = pathProp || from;
  return { path, exact, strict, sensitive };
};

// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Switch.js
const getRouteFromSwitch = (switchInstance, url) => {
  const currentRoute = switchInstance.context.router.route;
  const routes = switchInstance.props.children;

  let match = null;
  let component = null;
  React.Children.forEach(routes, routeElement => {
    if (match || !React.isValidElement(routeElement)) return;
    match = matchPath(
      parseUrl(url).pathname,
      getRouteProps(routeElement),
      currentRoute
    );
    if (!match) return;
    component = routeElement.props ? routeElement.props.component : null;
  });
  return component;
};

module.exports = async function getPropsFromTree(App, ctx) {
  // Example Tree: StaticRouter -> Router -> App -> Switch -> [Route] -> Page
  const parentWhitelist = ["StaticRouter", "Router", App.name, "Route"];

  let props = {};
  async function loadProps(component) {
    if (!component || !component.getInitialProps) return;
    const compProps = await component.getInitialProps(ctx);
    if (compProps) props = Object.assign({}, props, compProps);
  }

  // We load the route via the Switch components children so we have to make
  // sure we don't load it twice as we continue to walk down tree
  // note: seenRoutes can be null if no route was matched or undefined if compononent didn't have name
  const seenRoutes = [];
  const hasAlreadySeen = comp =>
    !!seenRoutes.find(r => (r && r.name) === (comp && comp.name));

  // To prevent walking entire tree we keep track of steps walked since last loaded component
  let stepsSinceLastServed = 0;

  await walkTree(App, async (element, instance) => {
    // We continue recursing until we've seen at least one switch route and five non-serveable components
    if (seenRoutes.length > 0 && stepsSinceLastServed === 5) return false;
    if (isSimpleElement(element)) return true;
    if (
      // Allow element in whitelist to pass unless it's a servable user component with same name (e.g. 'Router')
      (parentWhitelist.indexOf(element.type.name) > -1 &&
        !element.type.getInitialProps) ||
      // Wrapped async components hoist their child's static properties so we check for them separetly
      element.type.name === "LoadableComponent" ||
      // Hocs like 'connect' and 'withRouter' also hoist their child's static properties but use the
      // wrapper.WrappedComponent convetion, so we can skip over them too
      element.type.WrappedComponent
    )
      return true;

    const switchInstance = isSwitch(element) && instance;
    const servableComponent = isServable(element) && element.type;

    if (switchInstance) {
      const component = getRouteFromSwitch(switchInstance, ctx.req.url);
      if (component) await loadProps(component);
      seenRoutes.push(component); // add even empty vales since we still use non-matched routes for counting
      stepsSinceLastServed = 0;
    } else if (servableComponent && !hasAlreadySeen(servableComponent)) {
      await loadProps(servableComponent);
      stepsSinceLastServed = 0;
    } else {
      stepsSinceLastServed += 1;
    }
    return true;
  });

  return props;
};
