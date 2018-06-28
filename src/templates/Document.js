const { createElement: h } = require('react')
const { AppPlaceholder, SsrDataScript } = require('rogue')

module.exports = function Document ({ data, helmet, styles }) {
  // get attributes from React Helmet
  const htmlAttrs = helmet.htmlAttributes.toComponent()
  const bodyAttrs = helmet.bodyAttributes.toComponent()

  return h('html', htmlAttrs,
    h('head', null, 
      h('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }),
      h('meta', { charSet:'utf-8' }),
      h('title', null, 'Welcome!'),
      h('meta', { name: 'viewport', content: 'width=device-width', 'initial-scale': 1 }),
      helmet.title.toComponent(),
      helmet.link.toComponent(),
      styles
     ),
     h('body', bodyAttrs,
      h(AppPlaceholder),
      h(SsrDataScript, { data }),
      h('script', { src: 'bundle.js', defer: true })
    )
  )
}