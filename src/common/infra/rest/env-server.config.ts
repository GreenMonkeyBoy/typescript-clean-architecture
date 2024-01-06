import { injectable } from 'inversify'

import { CONFIG } from '../../../config'
import { ServerConfig } from './server-config.interface'

@injectable()
export class EnvServerConfig implements ServerConfig {
  getPort() {
    const envPort = process.env['PORT']

    if (envPort) {
      return parseInt(envPort)
    }

    return CONFIG.port
  }
}
