import Fastify, { FastifyInstance, RawServerDefault, RouteOptions } from 'fastify'
import { injectable } from 'inversify'

@injectable()
export class FastifyServer {
  #instance: FastifyInstance

  constructor() {
    this.#instance = Fastify()
  }

  async listen(port?: number) {
    await this.#instance.listen({ port })
  }

  async stop() {
    await this.#instance.close()
  }

  addRoute(options: RouteOptions) {
    this.#instance.route(options)
    return this
  }

  get instance() {
    return this.#instance
  }

  get server(): RawServerDefault {
    return this.#instance.server
  }
}
