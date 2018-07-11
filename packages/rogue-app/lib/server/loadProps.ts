import walkTree from 'react-tree-walker' 

const isSwitch = el => el.type && el.type.name === 'Switch'
const isLoadable = el => el.type && typeof el.type.getInitialProps === 'function'

export default async function loadPropsFromTree (App, ctx) {
  const appParents = ['StaticRouter', 'Router']

  let props = {}
  async function getInitialProps (component) {
    if (!component || !component.getInitialProps) return
    const compProps = await component.getInitialProps(ctx)
    if (compProps) props = Object.assign({}, props, compProps)
  } 

  await walkTree(App, async (element, instance) => {
    if (appParents.indexOf(element.type.name) > -1) return true 
    
    if (isLoadable(element)) {
      await getInitialProps(element.type)
      return false 
    }
    
    if (isSwitch(element)) return false
    else return true
  })

  return props
}