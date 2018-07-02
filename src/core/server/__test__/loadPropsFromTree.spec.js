const React = require('react')
const { StaticRouter, Switch, Route } = require('react-router-dom')
const loadPropsFromTree = require('../loadPropsFromTree')
const { join } = require('path')

const basePath = '/'
const nestedPath1 = '/nested1'
const nestedPath2 = '/nested2'

let fakeInitialProps = jest.fn()

const Provider = (props) => <div>{props.children}</div>
Provider.getInitialProps = fakeInitialProps

const Page = (props) => <div>{props.children}</div>
Page.getInitialProps = fakeInitialProps

const LayoutPage = (props) => (
  <div>
    <Switch>
      <Route exact path={nestedPath1} component={Page} />
      <Route exact path={nestedPath2} component={Page} />
    </Switch>
    {props.children}
  </div>
)

LayoutPage.getInitialProps = fakeInitialProps

const AppWithLayout = () => (
  <Switch>
    <Route exact path={basePath} component={LayoutPage} /> 
  </Switch> 
)

const Routable = (props) => (
  <StaticRouter context={{}} location={basePath}>
    {props.children}
  </StaticRouter>
)

const fakeReq = (url) => ({ req: { url } })

beforeEach(() => {
  fakeInitialProps.mockReset()
})

test('It loads matched page', async () => {
  await loadPropsFromTree(
    <Routable>
      <Switch>
        <Route exact path={basePath} component={Page} /> 
      </Switch> 
    </Routable>, 
    fakeReq(basePath)
  )
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})

test('It loads matched layout and page', async () => {
  await loadPropsFromTree(
    <Routable>
      <AppWithLayout>
      </AppWithLayout>
    </Routable>, 
    fakeReq(nestedPath1)
  )
  expect(fakeInitialProps.mock.calls.length).toBe(2)
})

test('It loads matched layout but not unmatched page', async () => {
  await loadPropsFromTree(
    <Routable>
      <AppWithLayout />
    </Routable>, 
    fakeReq(join(basePath, '/random'))
  )
  expect(fakeInitialProps.mock.calls.length).toBe(1)
})

test('It loads provider, page, and layout', async () => {
  await loadPropsFromTree(
    <Routable>
      <Provider>
        <AppWithLayout />
      </Provider>
    </Routable>, 
    fakeReq(nestedPath1)
  )
  expect(fakeInitialProps.mock.calls.length).toBe(3)
})
