const FACTORIES = {
  value: Symbol('value'),
  instance: Symbol('instance')
}

class InstanceDefinition {
  constructor(name, instance) {
    this.name = name
    this.instance = instance
  }
}

const valueFactory  = (modelDefinition) => {
  return modelDefinition.model
}

const instanceFactory  = (modelDefinition, locator) => {
  const parameters = modelDefinition.parameterInstanceNames.map(name => {
    return locator
      .getInstanceDefinition(name)
      .instance
  })
  const instance = new modelDefinition.model(...parameters)

  return instance
}

export class ModelDefinition {
  constructor(name, model, parameterInstanceNames = [], factory=FACTORIES.instance) {
    this.name = name
    this.model = model
    this.factory = factory
    this.parameterInstanceNames = parameterInstanceNames
  }
}

export class ContainerLocator {

  constructor({ factories = {} } = {}) {
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

  registerInstanceDefinition(instanceDefinition) {
    this.instanceDefinitions.push(instanceDefinition)

    return this
  }

  registerModelDefinition(modelDefinition) {
    this.modelDefinitions.push(modelDefinition)

    return this
  }

  register(name, instance, parameterInstanceNames=[], factory=FACTORIES.instance) {
    const modelDefinition = new ModelDefinition(name, instance, parameterInstanceNames, factory)
    this.registerModelDefinition(modelDefinition)

    return this
  }

  registerValue(name, value) {
    this.register(name, value, [], FACTORIES.value)

    return this
  }

  findModelDefinition(name, single = true) {
    const definitions = this.modelDefinitions.filter(e => e.name == name)

    if (single && definitions instanceof Array) {
      return definitions.length > 0 ? definitions[0] : null
    }

    return definitions
  }

  findInstanceDefinition(name, single = true) {
    const definitions = this.instanceDefinitions.filter(e => e.name == name)

    if (single && definitions instanceof Array) {
      return definitions.length > 0 ? definitions[0] : null
    }

    return definitions
  }

  getFactory(name) {
    return this.factories[name]
  }

  initiateModelDefinition(modelDefinition, reinitiate=false) {
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

  getInstanceDefinition(name) {
    const modeDefinition = this.findModelDefinition(name)

    return this.initiateModelDefinition(modeDefinition)
  }

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

// module.exports = {
//   ContainerLocator,
//   ModelDefinition,
//   FACTORIES
// }
