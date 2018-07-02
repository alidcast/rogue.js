const React = require('react')
const walkTree = require('react-tree-walker')
const { matchPath } = require('react-router-dom')
const { parse: parseUrl } = require('url')

const isSimpleElement = el => !el.type 

const isSwitch = el => el.type && el.type.name === 'Switch'

const isLoadable = el => el.type && typeof el.type.getInitialProps === 'function'

const getRouteProps = el => {
  const { path: pathProp, exact, strict, sensitive, from } = el.props
  const path = pathProp || from
  return { path, exact, strict, sensitive }
}

const loadRoute = (switchInstance, url) => {
  const currentRoute = switchInstance.context.router.route 
  const routes = switchInstance.props.children
  
  let match = null, component = null
  React.Children.forEach(routes, routeElement => {
    if (match || !React.isValidElement(routeElement)) return
    match = matchPath(
      parseUrl(url).pathname, 
      getRouteProps(routeElement), 
      currentRoute
    )
    if (!match) return
    component = (routeElement.props || {}).component
  })
  return component
} 

module.exports = async function getPropsFromTree (App, ctx) {
  // Example Tree: StaticRouter -> Router -> App -> Switch -> [Route] -> Page
  const parentWhitelist = ['StaticRouter', 'Router', App.name, 'Route']

  
  let props = {}
  async function loadProps (component) {
    if (!component || !component.getInitialProps) return
    const compProps = await component.getInitialProps(ctx)
    if (compProps) props = Object.assign({}, props, compProps)
  }

  // We load the route via the Switch components children so we have to make
  // sure we don't load it twice as we continue to walk down tree
  // note: seenRoutes can be null if no route was matched
  let seenRoutes = []
  const hasAlreadySeen = comp => comp && (seenRoutes.find(r => r && (r.name === comp.name)) !== undefined)

  // To prevent walking entire tree we keep track of steps walked since last loaded component
  let stepsSinceLastLoaded = 0

  await walkTree(App, async (element, instance) => {
    // This is a bit hacky but we assume we're walking a layout->page setup, so ideally, we continue
    // recursing until we've seen two switch routes; however, if there's no layout, we don't want to 
    // walk entire tree, so we'll stop after we've seen five non-loadable components.
    // And since there's no reason why there shouldn't be at least one switch route, so in that case we'll 
    // keep walking until we find it.
    if (seenRoutes.length === 2 || (seenRoutes.length === 1 && stepsSinceLastLoaded === 5)) return false
    else if (isSimpleElement(element)) {
      stepsSinceLastLoaded++
      return true 
    } else if (
      // Allow element in whitelist to pass unless it's custom user component that needs processing
      parentWhitelist.indexOf(element.type.name) > -1 && !element.type.getInitialProps
    ) return true

    const switchInstance = isSwitch(element) && instance
    const loadableComponent = isLoadable(element) && element.type

    if (switchInstance) {
      const component = loadRoute(switchInstance, ctx.req.url)
      await loadProps(component)
      seenRoutes.push(component)
      stepsSinceLastLoaded = 0
    } else if (loadableComponent && !hasAlreadySeen(loadableComponent)) {
      await loadProps(loadableComponent)
      stepsSinceLastLoaded = 0
    } else {
      stepsSinceLastLoaded++
    }

    return true
  })

  return props
}