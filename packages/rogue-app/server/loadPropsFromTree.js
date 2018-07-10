const React = require('react')
const walkTree = require('react-tree-walker')

const isSimpleElement = el => !el.type 

const isSwitch = el => el.type && el.type.name === 'Switch'

const isLoadable = el => el.type && typeof el.type.getInitialProps === 'function'

module.exports = async function loadPropsFromTree (App, ctx) {
  const appParents = ['StaticRouter', 'Router']

  // TODO remove router params / uncessary client logic since its only server
  // possibly rename route
  let props = {}
  async function loadProps (component, match = {}) {
    if (!component || !component.getInitialProps) return
    const compProps = await component.getInitialProps(ctx)
    if (compProps) props = Object.assign({}, props, compProps)
  } 

  await walkTree(App, async (element, instance) => {
    if (appParents.indexOf(element.type.name) > -1) return true 
    
    if (isLoadable(element)) {
      await loadProps(element.type)
      return false 
    }
    
    if (isSwitch(element)) return false
    else return true
  })

  return props
}