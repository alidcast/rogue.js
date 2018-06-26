const React = require('react')
const serialize = require('serialize-javascript')

exports.AppPlaceholder = () =>
  React.createElement('div', { id: 'root' }, 'DO NOT DELETE THIS OR YOU WILL BREAK YOUR APP')

exports.SsrDataScript = ({ data }) =>
  React.createElement('script', {
    id: '__rogue__',
    type: 'application/json',
    dangerouslySetInnerHTML: {
      __html: serialize(data).replace(/<\/script>/g, '%3C/script%3E')
    }
  })