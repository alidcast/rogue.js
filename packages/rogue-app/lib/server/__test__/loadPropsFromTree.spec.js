const React = require('react')
const { StaticRouter, Switch, Route } = require('react-router-dom')
const loadPropsFromTree = require('../loadPropsFromTree')
const { join } = require('path')

let fakeInitialProps = jest.fn()

const StoreProvider = (props) => <div>{props.children}</div>
const StyleProvider = (props) => <div>{props.children}</div>

const App = (props) => <div>{props.children}</div>
App.getInitialProps = fakeInitialProps

const Page = (props) => <div>{props.children}</div>
Page.getInitialProps = fakeInitialProps // shouldn't never called 

const hoc = Wrapper => Component => {
  const Wrapper = (props) => <Component {...props} />
  Wrapper.getInitialProps = async function (ctx) {
    if (Component.getInitialProps) await Component.getInitialProps(ctx)
    return fakeInitialProps(ctx)
  }
  return Wrapper
}

beforeEach(() => {
  fakeInitialProps.mockReset()
})

test('It loads app', async () => {
  await loadPropsFromTree(<App />)
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})

test('It loads app with one provider', async () => {
  const EnhancedApp = hoc(StoreProvider)(App)
  await loadPropsFromTree(<EnhancedApp />)
  expect(fakeInitialProps.mock.calls.length).toBe(2)
})

test('It loads app with multiple providers', async () => {
  const EnhancedApp = hoc(StoreProvider)(hoc(StyleProvider)(App))
  await loadPropsFromTree(<EnhancedApp />)
  expect(fakeInitialProps.mock.calls.length).toBe(3)
})

test('Does not walk/load past switch statement', async () => {
  await loadPropsFromTree(
    <StaticRouter context={{}} location="/">
      <App>
        <Switch>
          <Route path="/" component={Page} />
        </Switch>
      </App>
    </StaticRouter>
  )
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})


test('Loads up to switch statement', async () => {
  await loadPropsFromTree(
    <StaticRouter context={{}} location="/">
      <App>
        <Switch>
          <Route path="/" component={Page} />
        </Switch>
      </App>
    </StaticRouter>
  )
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})