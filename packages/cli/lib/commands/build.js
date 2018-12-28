process.env.NODE_ENV = 'production'

const bundle = require('../bundle')
const logger = require('../logger')

bundle()
  .then(() => {
    logger.persistSpinner(logger.emoji.success, `Build successfull!`, 'green')
  })
  .catch((err) => {
    logger.error(err)
  })