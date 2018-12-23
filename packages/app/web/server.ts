import Rogue, { RogueOptions } from '../lib/rogue'

export default function rogue(App, bundleUrl, options: RogueOptions = {}) {
  return new Rogue(
    App, 
    Object.assign(options, {
      bodyTags: [
        `<script src=${bundleUrl} defer /></script>`
      ].concat(options.bodyTags || [])
    })
  )
}