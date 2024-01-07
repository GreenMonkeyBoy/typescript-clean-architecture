import { plainToInstance } from 'class-transformer'
import { RouteOptions } from 'fastify'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../../common/infra/ioc/types'
import { Controller } from '../../../../../../common/infra/rest/fastify/controller.interface'
import { AuthorizationRequestHandler } from '../../../../../../common/infra/rest/fastify/request-handlers/authorization.request-handler'
import { ValidationRequestHandler } from '../../../../../../common/infra/rest/fastify/request-handlers/validation.request-handler'
import { ErrorResponsePayload } from '../../../../../../common/infra/rest/response-payload'
import { DeleteAuthorUseCase } from '../../../../../application/use-cases/delete-author/delete-author.usecase'
import { DeleteAuthorParamDto } from './dto/delete-author-params.dto'

@injectable()
export class DeleteAuthorController implements Controller {
  constructor(
    @inject(TYPES.DeleteAuthorUseCase)
    private deleteAuthorUseCase: DeleteAuthorUseCase,
  ) {}

  get route(): RouteOptions {
    return {
      method: 'DELETE',
      url: '/authors/:id',
      preHandler: async (req, reply) => {
        const requestHandler = new ValidationRequestHandler({
          params: DeleteAuthorParamDto,
        })

        requestHandler.setNext(new AuthorizationRequestHandler())

        return requestHandler.handle(req, reply)
      },
      errorHandler(error, request, reply) {
        return reply
          .status(500)
          .send(ErrorResponsePayload.createInternalServerError())
      },
      handler: async (req, reply) => {
        const params = plainToInstance(DeleteAuthorParamDto, req.params)

        await this.deleteAuthorUseCase.execute(params.id)

        return reply.status(204).send()
      },
    }
  }
}
