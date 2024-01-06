interface Config {
  dbName: string
  dbUri: string
  port: number
}

const CONFIG_DEV: Config = {
  dbName: 'clean_architecture',
  dbUri: 'mongodb://localhost:27017',
  port: 3000,
}

const CONFIG_TEST = {
  dbName: 'clean_architecture_test',
  dbUri: 'mongodb://localhost:27017',
  port: 3000,
}

let CONFIG: Config = CONFIG_DEV

if (process.env['NODE_ENV'] === 'test') {
  CONFIG = CONFIG_TEST
}

export { CONFIG }
