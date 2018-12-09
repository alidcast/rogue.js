import * as React from 'react'
import appMiddleware from '../appMiddleware'
import { load } from 'cheerio'

function SimpleApp () {
  return <div>Hello World!</div>
}

describe('appMiddleware', () => {
  const req = { url: 'http://localhost:3000' }
  const res = { setHeader: jest.fn(), end: jest.fn() }

  const get$ = () => load(res.end.mock.calls[0][0])

  afterEach(() => {
    res.setHeader.mockReset()
    res.end.mockReset()
  })

  it('sends app html', async () => {
    const handler = appMiddleware(SimpleApp)
    await handler(req, res)
    expect(get$().html()).toContain('Hello World')
  })

  it('sets custom head and body tags', async () => {
    const handler = appMiddleware(SimpleApp, { 
      headTags: [`<link rel="stylesheet">`], bodyTags: [`<script src="somewhere" defer></script>`]
    })
    await handler(req, res)
    const $ = get$()
    expect($('head').html()).toContain(`<link rel="stylesheet">`)
    expect($('body').html()).toContain(`<script src="somewhere" defer></script>`)
  })
})