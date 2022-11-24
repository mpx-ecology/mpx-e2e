const utils = require('./utils')

function initExpect () {
  try {
    // eslint-disable-next-line no-undef
    const oldexpect = expect

    // eslint-disable-next-line no-undef
    expect = function (...args) {
      utils.pushExpect()
      return oldexpect(...args)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = initExpect
