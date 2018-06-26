import express from 'express'
import { renderHtml } from 'rogue'

import App from 'TEMPORARY_APP_PATH'
// import Document from 'TEMPORARY_DOCUMENT_PATH'

// absolute paths get resolved as unexpected tokens
// and rogue is not wokring for some reason
import Document from '../../src/Document.tsx'

const app = express()

app
  .use(express.static('public'))
  .get('*', async (req, res) => {
    try {
      const html = await renderHtml({
        req,
        res,
        Document,
        App
      })
      res.send(html)
    } catch (err) {
      res.json(err)
    }
  })

export default app