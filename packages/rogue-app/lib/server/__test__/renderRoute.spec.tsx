import * as React from 'react'
import renderRoute from '../renderRoute'
// import { StaticRouter, Switch, Route } from 'react-router-dom'
// import loadProps from '../loadProps'

let fakeInitialProps = jest.fn()

const serverCtx = { req: { url: '/' }, res: {} }

const App: any = (props) => <div>{props.children}</div>
App.getInitialProps = fakeInitialProps

const withHoc = Component => {
  const Provider: any = (props) => <div><Component {...props} /></div>
  Provider.getInitialProps = async function (ctx) {
    if (Component.getInitialProps) await Component.getInitialProps(ctx)
    return fakeInitialProps(ctx)
  }
  return Provider
}


beforeEach(() => {
  fakeInitialProps.mockReset()
})

test('It loads app', async () => {
  await renderRoute(App, {}, serverCtx)
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})

test('It loads app with one provider', async () => {
  const EnhancedApp = withHoc(App)
  await renderRoute(EnhancedApp, {}, serverCtx)
  expect(fakeInitialProps.mock.calls.length).toBe(2)
})

test('It loads app with multiple providers', async () => {
  const EnhancedApp = withHoc(withHoc(App))
  await renderRoute(EnhancedApp, {}, serverCtx)
  expect(fakeInitialProps.mock.calls.length).toBe(3)
})