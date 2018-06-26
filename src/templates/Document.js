import React from 'react'
import { AppPlaceholder, SsrDataScript } from 'rogue'

export default function Document ({ data, helmet }) {
  // get attributes from React Helmet
  const htmlAttrs = helmet.htmlAttributes.toComponent()
  const bodyAttrs = helmet.bodyAttributes.toComponent()

  return (
    <html {...htmlAttrs}>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <title>Welcome to the Afterparty</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
      </head>
      <body {...bodyAttrs}>
        <AppPlaceholder />
        <SsrDataScript data={data} />
        <script src="bundle.js" defer />
      </body>
    </html>
  )
}