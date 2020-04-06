// const { ContainerLocator } = require('instance-locator') // Uncomment for your case.
const { ContainerLocator } = require('../src')

const config = {
  test: 'configTest'
}

class CoreModel {
  constructor(config) {
    this.config = config
  }
  test() { return 'coreTest' }
}

class DbModel {
  constructor(core) {
    this.core = core
  }

  test() {
    return 'dbTest'
  }

}

const TYPES = {
  config: Symbol('config'),
  core: Symbol('core'),
  db: Symbol('db')
}

const locator = new ContainerLocator()
locator
  .registerValue(TYPES.config, config)
  .register(TYPES.core, CoreModel, [ TYPES.config ])
  .register(TYPES.db, DbModel, [TYPES.core])

const instance = locator.get(TYPES.db)
const core = locator.get(TYPES.core)

// Outputs dbTest.
console.log(instance.test(), 'dbTest')

// Outputs coreTest.
console.log(instance.core.test())

// Outputs configTest.
console.log(instance.core.config.test)

// Same instances.
console.log('Same instances - ', core == instance.core)
