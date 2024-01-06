import { RouteOptions } from 'fastify'

export interface Controller {
  get route(): RouteOptions
}
