import * as React from 'react'
import appMiddleware from '../rogueMiddleware'
import { load } from 'cheerio'

const App: any = () => <div>Hello World</div>
App.getInitialProps = jest.fn()

const withHoc = Component => {
  const Provider: any = (props) => <div><Component {...props} /></div>
  Provider.getInitialProps = async function (ctx) {
    if (Component.getInitialProps) await Component.getInitialProps(ctx)
    return App.getInitialProps(ctx)
  }
  return Provider
}

describe('appMiddleware', () => {
  const req = { url: 'http://localhost:3000' }
  const res = { setHeader: jest.fn(), end: jest.fn() }

  const get$ = () => load(res.end.mock.calls[0][0])

  afterEach(() => {
    App.getInitialProps.mockReset()
    res.setHeader.mockReset()
    res.end.mockReset()
  })

  test('it loads app', async () => {
    await appMiddleware(App)(req, res)
    expect(App.getInitialProps.mock.calls.length).toBe(1)
  })
  
  test('It loads app with one provider', async () => {
    const EnhancedApp = withHoc(App)
    await appMiddleware(EnhancedApp)(req, res)
    expect(App.getInitialProps.mock.calls.length).toBe(2)
  })
  
  test('it loads app with multiple providers', async () => {
    const EnhancedApp = withHoc(withHoc(App))
    await appMiddleware(EnhancedApp)(req, res)
    expect(App.getInitialProps.mock.calls.length).toBe(3)
  })

  it('sends app html', async () => {
    await appMiddleware(App)(req, res)
    expect(get$().html()).toContain('Hello World')
  })

  it('sets custom head and body tags', async () => {
    const handler = appMiddleware(App, { 
      headTags: [`<link rel="stylesheet">`], bodyTags: [`<script src="somewhere" defer></script>`]
    })
    await handler(req, res)
    const $ = get$()
    expect($('head').html()).toContain(`<link rel="stylesheet">`)
    expect($('body').html()).toContain(`<script src="somewhere" defer></script>`)
  })
})