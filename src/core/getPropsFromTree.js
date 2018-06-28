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

// Walk App and load data from `getInitialProps`
// There are three types of element's we're looking to load: Providers, Layouts, and Pages.
// We assume each one will have a `getInitialProps` property. So when we find a component
// with one, we load the data, and continue recursing. To prevent walking the entire tree
// we only look at a parent and it's direct children and if neither is loadable we end early. 
module.exports = async function getPropsFromTree (App, { req }) {
  // Example Tree: StaticRouter -> Router -> App -> Switch -> [Route] -> Page
  const parentWhitelist = ['StaticRouter', 'Router', App.name, 'Route']

  let props = {}
  async function loadProps (component) {
    if (!component || !component.getInitialProps) return
    const compProps = await component.getInitialProps()
    if (compProps) props = Object.assign({}, props, compProps)
  }

  // We load the route via the Switch components children so we have to make
  // sure we don't load it twice as we continue to walk down tree
  // note: seenRoutes can be null if no route was matched
  let seenRoutes = []
  const hasAlreadySeen = comp => comp && (seenRoutes.find(r => r && (r.name === comp.name)) !== undefined)

  await walkTree(App, async (element, instance) => {
    if (seenRoutes.length === 2) return false
    else if (isSimpleElement(element) || parentWhitelist.indexOf(element.type.name) > -1) return true
    
    const switchInstance = isSwitch(element) && instance
    const loadableComponent = isLoadable(element) && element.type

    if (switchInstance) {
      const component = loadRoute(switchInstance, req.url)
      await loadProps(component)
      seenRoutes.push(component)
    } else if (loadableComponent && !hasAlreadySeen(loadableComponent)) {
      await loadProps(loadableComponent)
    }
    return true
  })

  return props
}