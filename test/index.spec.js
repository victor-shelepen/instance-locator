const { test } = require('../src/index')
const assert = require('assert')

describe('Test', () => {
  it('Testing...', () => {
    const str = test()
    assert.equal(str, 'testing...')
  })
})
