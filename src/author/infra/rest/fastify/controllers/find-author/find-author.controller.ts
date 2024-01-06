import { plainToInstance } from 'class-transformer'
import { RouteOptions } from 'fastify'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../../common/infra/ioc/types'
import { Controller } from '../../../../../../common/infra/rest/fastify/controller.interface'
import { ValidationRequestHandler } from '../../../../../../common/infra/rest/fastify/request-handlers/validation.request-handler'
import {
  ErrorResponsePayload,
  SuccessResponsePayload,
} from '../../../../../../common/infra/rest/response-payload'
import { FindAuthorUseCase } from '../../../../../application/use-cases/find-author/find-author.usecase'
import { AuthorErrors } from '../../../../../domain/errors/author.errors'
import { AuthorDomainErrorMapper } from '../../../author-domain-error.mapper'
import { AuthorPresenter } from '../../../author.presenter'
import { FindAuthorParamDto } from './dto/find-author-params.dto'

@injectable()
export class FindAuthorController implements Controller {
  constructor(
    @inject(TYPES.FindAuthorUseCase) private findAuthorUseCase: FindAuthorUseCase,
    @inject(TYPES.AuthorDomainErrorMapper) private authorDomainErrorMapper: AuthorDomainErrorMapper
  ) {}

  get route(): RouteOptions {
    return {
      method: 'GET',
      url: '/authors/:id',
      preHandler: async (req, reply) => {
        const validationRequestHandler = new ValidationRequestHandler({
          params: FindAuthorParamDto,
        })
        return validationRequestHandler.handle(req, reply)
      },
      errorHandler(error, request, reply) {
        return reply.status(500).send(ErrorResponsePayload.createInternalServerError())
      },
      handler: async (req, reply) => {
        const params = plainToInstance(FindAuthorParamDto, req.params)

        const result = await this.findAuthorUseCase.execute(params.id)

        if (result.isFailure()) {
          if (result.error.code === AuthorErrors.NOT_FOUND) {
            return reply
              .status(404)
              .send(this.authorDomainErrorMapper.mapAuthorNotFoundError(result.error))
          }
          return reply.status(500).send(ErrorResponsePayload.createInternalServerError())
        }

        const authorDto = AuthorPresenter.create(result.data)

        return reply.status(200).send(new SuccessResponsePayload(authorDto))
      },
    }
  }
}
