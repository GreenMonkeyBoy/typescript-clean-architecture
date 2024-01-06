import { injectable } from 'inversify'

import { CONFIG } from '../../../config'
import { DatabaseConfig } from './interfaces/database-config.interface'

@injectable()
export class EnvDatabaseConfig implements DatabaseConfig {
  getDbUri(): string {
    return process.env['DB_URI'] || CONFIG.dbUri
  }

  getDbName(): string {
    return process.env['DB_NAME'] || CONFIG.dbName
  }
}
