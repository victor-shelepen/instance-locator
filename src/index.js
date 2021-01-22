/**
 * Instance locator implementation
 * 
 * @module InstanceLocator
 */

/**
 * @typedef {Object} FactoryOptions
 * @param {Object} modelDefinition - Model definition.
 * @param {ContainerLocator} [locator] - Container locator.
 */

/** 
  * @enum {Symbol}
  */
const FACTORIES = {
  value: Symbol('value'),
  instance: Symbol('instance')
}

class InstanceDefinition {

  /**
   * @param {string} name 
   * @param {object} instance 
   */
  constructor(name, instance) {
    this.name = name
    this.instance = instance
  }
}

/** 
 * @param {ModelDefinition} modelDefinition 
 */
const valueFactory = (modelDefinition) => {
  return modelDefinition.model
}

/**
 * @param {ModelDefinition} modelDefinition 
 * @param {ContainerLocator} locator 
 * @returns {Object} instance
 */
const instanceFactory = (modelDefinition, locator) => {
  const parameters = modelDefinition.parameterInstanceNames.map(name => {
    return locator
      .getInstanceDefinition(name)
      .instance
  })
  const instance = new modelDefinition.model(...parameters)

  return instance
}
export class ModelDefinition {
  /**
   * @param {string} name 
   * @param {Object} model 
   * @param {string[]} parameterInstanceNames 
   * @param {FactoryOptions|Symbol|null} factory 
   */
  constructor(name, model, parameterInstanceNames = [], factory = FACTORIES.instance) {
    this.name = name
    this.model = model
    this.factory = factory
    this.parameterInstanceNames = parameterInstanceNames
  }
}

export class ContainerLocator {

  /**
   * @param {Object} options 
   */
  constructor(options = {}) {
    const { factories = {} } = options
    this.modelDefinitions = []
    this.instanceDefinitions = []
    this.factories = {
      ...factories,
      ...{
        [FACTORIES.value]: valueFactory,
        [FACTORIES.instance]: instanceFactory
      }
    }
  }

  /**
   * @param {InstanceDefinition} instanceDefinition - Instance definition
   * @returns {ContainerLocator}
   */
  registerInstanceDefinition(instanceDefinition) {
    this.instanceDefinitions.push(instanceDefinition)

    return this
  }

  /**
   * @param {ModelDefinition} modelDefinition 
   * @returns {ContainerLocator}
   */
  registerModelDefinition(modelDefinition) {
    this.modelDefinitions.push(modelDefinition)

    return this
  }

  /**
   * @param {string} name 
   * @param {Object} instance 
   * @param {string[]} parameterInstanceNames 
   * @param {FACTORIES|Symbol} factory
   * @returns {ContainerLocator}
   */
  register(name, instance, parameterInstanceNames = [], factory = FACTORIES.instance) {
    const modelDefinition = new ModelDefinition(name, instance, parameterInstanceNames, factory)
    this.registerModelDefinition(modelDefinition)

    return this
  }

  /**
   * @param {string} name 
   * @param {*} value 
   */
  registerValue(name, value) {
    this.register(name, value, [], FACTORIES.value)

    return this
  }

  /**
   * @param {string} name 
   * @param {boolean} single
   * @returns {ModelDefinition[]|ModelDefinition|null}
   */
  findModelDefinition(name, single = true) {
    const definitions = this.modelDefinitions.filter(e => e.name == name)

    if (single && definitions instanceof Array) {
      return definitions.length > 0 ? definitions[0] : null
    }

    return definitions
  }

  /**
   * @param {string} name 
   * @param {boolean} single
   * @returns {ModelInstance[]|ModelInstance|null}
   */
  findInstanceDefinition(name, single = true) {
    const definitions = this.instanceDefinitions.filter(e => e.name == name)

    if (single && definitions instanceof Array) {
      return definitions.length > 0 ? definitions[0] : null
    }

    return definitions
  }

  /**
   * @param {string} name
   * @returns {*}
   */
  getFactory(name) {
    return this.factories[name]
  }

  /**
   * @param {ModelDefinition} modelDefinition 
   * @param {boolean} reinitiate
   * @returns {*}
   */
  initiateModelDefinition(modelDefinition, reinitiate = false) {
    let instanceDefinition
    if (!reinitiate) {
      instanceDefinition = this.findInstanceDefinition(modelDefinition.name)
      if (instanceDefinition) {
        return instanceDefinition
      }
    }
    const factory = this.getFactory(modelDefinition.factory)
    instanceDefinition = factory(modelDefinition, this)
    instanceDefinition = new InstanceDefinition(modelDefinition.name, instanceDefinition)
    this.registerInstanceDefinition(instanceDefinition)

    return instanceDefinition
  }

  /**
   * @param {string} name 
   * @returns {*}
   */
  getInstanceDefinition(name) {
    const modeDefinition = this.findModelDefinition(name)

    return this.initiateModelDefinition(modeDefinition)
  }

  /**
   * @param {string} name 
   * @returns {*}
   */
  get(name) {
    const instanceDefinition = this.getInstanceDefinition(name)

    return instanceDefinition.instance
  }

  clearInstances() {
    this.instanceDefinitions = []
  }

  clearDefinitions() {
    this.clearInstances()
    this.modelDefinitions = []
  }

}
