process.env.NODE_ENV = 'production'

const bundle = require('../bundle')
const logger = require('../logger')
const { getApp } = require('../utils')

const PORT = process.env.PORT || 3000

logger.updateSpinner('Starting server...')

const app = getApp()

app.listen(PORT,  error => {
  if (error) logger.error(error)
  else logger.persistSpinner(logger.emoji.success, `Server listening on port ${PORT}.`, 'green')
})