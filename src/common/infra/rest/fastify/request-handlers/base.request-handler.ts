import { FastifyReply, FastifyRequest } from 'fastify'

export interface RequestHandler {
  handle(req: FastifyRequest, reply: FastifyReply): Promise<void>
  setNext(handler: RequestHandler): RequestHandler
}

export abstract class BaseRequestHandler implements RequestHandler {
  private nextHandler: RequestHandler | null = null

  setNext(handler: RequestHandler) {
    this.nextHandler = handler
    return handler
  }

  async handle(req: FastifyRequest, reply: FastifyReply) {
    if (this.nextHandler) {
      return this.nextHandler.handle(req, reply)
    }
    return
  }
}
