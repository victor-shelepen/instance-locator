import { ContainerLocator, ModelDefinition } from '../src/index'

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
      expect(modelDefinition).toBeInstanceOf(ModelDefinition)
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

    beforeAll(() => {
      locator = new ContainerLocator()
      locator
        .registerValue(TYPES.config, config)
        .register(TYPES.core, CoreModel, [ TYPES.config ])
      modelDefinition = new ModelDefinition(TYPES.db, DbModel, [TYPES.core])
      locator.registerModelDefinition(modelDefinition)
    })

    it('Find model definition', () => {
      const definition = locator.findModelDefinition(TYPES.db)
      expect(definition.name).toEqual(TYPES.db)
    })

    it('Initiate definition', () => {
      const dbModelDefinition = locator.findModelDefinition(TYPES.db)
      const instanceDefinition = locator.initiateModelDefinition(dbModelDefinition)
      expect(instanceDefinition.instance.test()).toEqual('dbTest')
    })

    it('Get / Nested / single instance.', () => {
      const instance = locator.get(TYPES.db)
      const core = locator.get(TYPES.core)
      expect(instance.test()).toEqual('dbTest')
      expect(instance.core.test()).toEqual('coreTest')
      expect(instance.core.config.test).toEqual('configTest')
      expect(core).toEqual(instance.core)
    })

    afterAll(() => {
      locator.clearDefinitions()
    })

  })
})
