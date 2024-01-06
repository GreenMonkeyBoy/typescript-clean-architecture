import { FastifyReply, FastifyRequest } from 'fastify'

import { ErrorResponsePayload } from '../../response-payload'
import { BaseRequestHandler } from './base.request-handler'

export class AuthorizationRequestHandler extends BaseRequestHandler {
  override async handle(req: FastifyRequest, reply: FastifyReply) {
    if (!req.headers.authorization) {
      return reply.status(401).send(
        ErrorResponsePayload.create({
          status: 401,
          message: `Unauthorized`,
        })
      )
    }

    return super.handle(req, reply)
  }
}
