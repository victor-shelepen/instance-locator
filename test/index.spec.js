const { ContainerLocator, ModelDefinition } = require('../src')
const assert = require('assert')

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
  test() { return 'dbTest' }
}

describe('Instance locator', () => {
  describe('Instance Definition', () => {})

  describe('Model definition', () => {
    let modelDefinition = new ModelDefinition('db', DbModel)

    it('Created', () => {
      assert(modelDefinition instanceof ModelDefinition)
    })
  })

  describe('Container Locator', () => {
    let locator
    let modelDefinition
    const TYPES = {
      config: Symbol('config'),
      core: Symbol('core'),
      db: Symbol('db')
    }

    before(() => {
      locator = new ContainerLocator()
      locator
        .registerValue(TYPES.config, config)
        .register(TYPES.core, CoreModel, [ TYPES.config ])
      modelDefinition = new ModelDefinition(TYPES.db, DbModel, [TYPES.core])
      locator.registerModelDefinition(modelDefinition)
    })

    it('Find model definition', () => {
      const definition = locator.findModelDefinition(TYPES.db)
      assert.equal(definition.name, TYPES.db)
    })

    it('Initiate definition', () => {
      const dbModelDefinition = locator.findModelDefinition(TYPES.db)
      const instanceDefinition = locator.initiateModelDefinition(dbModelDefinition)
      assert.equal(instanceDefinition.instance.test(), 'dbTest')
    })

    it('Get / Nested / single instance.', () => {
      const instance = locator.get(TYPES.db)
      const core = locator.get(TYPES.core)
      assert.equal(instance.test(), 'dbTest')
      assert.equal(instance.core.test(), 'coreTest')
      assert.equal(instance.core.config.test, 'configTest')
      assert(core == instance.core)
    })

    after(() => {
      locator.clearDefinitions()
    })

  })
})
