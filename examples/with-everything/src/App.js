import React from 'react'
import { compose } from 'recompose'
import { Helmet } from 'react-helmet'

import withApollo from 'rogue/hocs/apollo'
import withStore from 'rogue/hocs/redux'
import withStyles from 'rogue/hocs/emotion'

import createClient from './apollo'
import createStore from './store'
import theme from './styles/theme'

import Router from './Router'

class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Helmet>
          <title>Rougejs - with everything!</title>
        </Helmet>
        <Router />
      </React.Fragment>
    )
  }
}

export default compose(
  withApollo(createClient),
  withStore(createStore),
  withStyles(theme)
)(App)