import walkTree from 'react-tree-walker' 

const isSwitch = el => el.type && el.type.name === 'Switch'
const isLoadable = el => el.type && typeof el.type.getInitialProps === 'function'

export default async function loadPropsFromTree (App, ctx) {
  const parentWhitelist = ['StaticRouter', 'Router']

  let props = {}
  async function getInitialProps (component) {
    if (!component || !component.getInitialProps) return
    const compProps = await component.getInitialProps(ctx)
    if (compProps) props = Object.assign({}, props, compProps)
  } 

  await walkTree(App, async (element) => {
    if (element.type && parentWhitelist.indexOf(element.type.name) > -1) return true 

    // Only loading App.js Component (https://github.com/alidcastano/rogue.js/issues/42)
    // So we'll stop when we find first loadable component (hocs wrap each other's getInitialProps)
    // or when we find a switch statement as there's no need to walk past pages
    if (isLoadable(element)) {
      await getInitialProps(element.type)
      return false 
    } else if (isSwitch(element)) {
      return false
    }
    
    return true
  })

  return props
}