// https://github.com/DeMoorJasper/blazingly/blob/d370c2bac846536925d58d60ad98a40bc4476df3/packages/cli/src/functions/build.js
const ora = require('ora')
const chalk = require('chalk')

const logger = module.exports = {}

const supportsEmoji = process.platform !== 'win32' || process.env.TERM === 'xterm-256color'
logger.emoji = {
  unlocked: supportsEmoji ? '🔓' : '√',
  locked: supportsEmoji ? '🔒' : '×',
  success: supportsEmoji ? '✨' : '√',
  info: supportsEmoji ? '💬' : 'ℹ︎',
  error: supportsEmoji ? '🚨' : '×',
  warning: supportsEmoji ? '⚠️' : '⚠︎'
}

let spinner

logger.startSpinner = function() {
  if (spinner && !spinner.isSpinning) {
    spinner.start()
  }
}

logger.updateSpinner = function(text, color) {
  if (color) {
    text = chalk[color](text)
  }

  if (!spinner) {
    spinner = ora(text)
  }

  spinner.text = text

  logger.startSpinner()
}

logger.stopSpinner = function() {
  if (spinner) {
    spinner.stop()
  }
}

logger.persistSpinner = function (symbol, text, color) {
  if (color) {
    text = chalk[color](text)
  }

  if (spinner) {
    spinner.stopAndPersist({symbol, text})
  } else {
    logger.log(text)
  }
}

logger.log = function(text) {
  console.log(text)
}

logger.warn = function(text) {
  console.warn(`${logger.emoji.warning} ${chalk['yellow'](text)}`)
}

logger.error = function(error) {
  console.error(`${logger.emoji.error} ${chalk['red'](error.message)}`)
  console.error(error)
}