[![Build Status](https://travis-ci.org/vlikin/instance-locator.svg?branch=master)](https://travis-ci.org/vlikin/instance-locator)
[![Coverage Status](https://coveralls.io/repos/github/vlikin/instance-locator/badge.svg?branch=master)](https://coveralls.io/github/vlikin/instance-locator?branch=master)

[![NPM](https://nodei.co/npm/instance-locator.png?downloads=true&downloadRank=true)](https://nodei.co/npm/instance-locator/)
[![NPM](https://nodei.co/npm-dl/instance-locator.png?months=9&height=3)](https://nodei.co/npm/instance-locator/)

The library helps to build your own module system. Barely it resolves the Dependency Inversion Principle of SOLID.
It is used as a barebone for an application that simplifies logic integration and its usage.

Be free and ask me questions personally on [Gitter](https://gitter.im/vlikin/Lobby)

# Basic usage
#### Register basic models for future instance.
```javascript
const { ContainerLocator } = require('instance-licator')

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
```

#### Define symbols for instances
```javascript
const TYPES = {
  config: Symbol('config'),
  core: Symbol('core'),
  db: Symbol('db')
}
```

#### Create locator and register models
```javascript
const locator = new ContainerLocator()
locator
  .registerValue(TYPES.config, config)
  .register(TYPES.core, CoreModel, [ TYPES.config ])
  .register(TYPES.db, DbModel, [TYPES.core])
```

#### Initiate models by the locator, use your logic.
```javascript 
const instance = locator.get(TYPES.db)
const core = locator.get(TYPES.core)
```

#### Use your logic
```javascript
// Outputs dbTest.
console.log(instance.test(), 'dbTest')

// Outputs coreTest.
console.log(instance.core.test())

// Outputs configTest.
console.log(instance.core.config.test)

// Same instances.
console.log('Same instances - ', core == instance.core)
```

Also check [the basic example](./example/basic.js) and [tests](./test/index.spec.js).
