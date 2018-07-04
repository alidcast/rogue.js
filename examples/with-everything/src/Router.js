import React from 'react'
import { Switch, Route } from 'react-router-dom'
import loadable from 'loadable-components'

// import { getTokenFromReq } from './utils/auth'
// import { setSession, removeSession } from './store/session'
// import { authUserQuery } from './apollo/user/AuthUser'

// const routable = (Layout, Page) => props => <Layout {...props}><Page {...props} /></Layout>

// const App = loadable(() => import('~/app/layouts/App'))
// const Landing = loadable(() => import('~/app/layouts/Landing'))
// const Auth = loadable(() => import('~/app/layouts/Auth'))

// const Dashboard = loadable(() => import('~/app/pages/Dashboard')) 
// const Welcome = loadable(() => import('~/app/pages/Welcome'))
// const Register = loadable(() => import('~/app/pages/Register/index'))
// const Login = loadable(() => import('~/app/pages/Login'))

export default class Router extends React.Component {
  // static async getInitialProps (ctx) {
  //   await Router.refreshSession(ctx)
  // }

  // static async refreshSession (ctx) {
  //   const token = getTokenFromReq(ctx.req)
  //   if (!ctx.store.getState().session.user && token) {
  //     try {
  //       const res = await ctx.apollo.query({ query: authUserQuery })
  //       ctx.store.dispatch(setSession({ user: res.data.authUser }))
  //     } catch (err) { // invalid or expired token 
  //       console.log('Error refreshing session', err)
  //       ctx.apollo.resetStore()
  //       ctx.store.dispatch(removeSession())
  //     }
  //   }
  // }

  render () {
    return (
      <Switch>
        {/* <Route exact path="/welcome" render={routable(Landing, Welcome)} />
        <Route exact path="/register" render={routable(Auth, Register)} />
        <Route exact path="/login" render={routable(Auth, Login)} />
        <Route path="/" render={routable(App, Dashboard)} /> */}
      </Switch>
    )
  }
}