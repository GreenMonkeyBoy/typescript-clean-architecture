import { plainToInstance } from 'class-transformer'
import { RouteOptions } from 'fastify'
import { inject, injectable } from 'inversify'

import { TYPES } from '../../../../../../common/infra/ioc/types'
import { Controller } from '../../../../../../common/infra/rest/fastify/controller.interface'
import { AuthorizationRequestHandler } from '../../../../../../common/infra/rest/fastify/request-handlers/authorization.request-handler'
import { ValidationRequestHandler } from '../../../../../../common/infra/rest/fastify/request-handlers/validation.request-handler'
import {
  ErrorResponsePayload,
  SuccessResponsePayload,
} from '../../../../../../common/infra/rest/response-payload'
import { UpdateAuthorUseCase } from '../../../../../application/use-cases/update-author/update-author.usecase'
import { AuthorErrors } from '../../../../../domain/errors/author.errors'
import { AuthorDomainErrorMapper } from '../../../author-domain-error.mapper'
import { AuthorPresenter } from '../../../author.presenter'
import { UpdateAuthorBodyDto } from './dto/update-author-body.dto'
import { UpdateAuthorParamDto } from './dto/update-author-params.dto'

@injectable()
export class UpdateAuthorController implements Controller {
  mapper = new AuthorDomainErrorMapper()

  constructor(
    @inject(TYPES.UpdateAuthorUseCase) private updateAuthorUseCase: UpdateAuthorUseCase
  ) {}

  get route(): RouteOptions {
    return {
      method: 'PATCH',
      url: '/authors/:id',
      preHandler: async (req, reply) => {
        const requestHandler = new ValidationRequestHandler({
          params: UpdateAuthorParamDto,
          body: UpdateAuthorBodyDto,
        })

        requestHandler.setNext(new AuthorizationRequestHandler())

        return requestHandler.handle(req, reply)
      },
      errorHandler(error, request, reply) {
        return reply.status(500).send(ErrorResponsePayload.createInternalServerError())
      },
      handler: async (req, reply) => {
        const params = plainToInstance(UpdateAuthorParamDto, req.params)
        const body = plainToInstance(UpdateAuthorBodyDto, req.body)

        const result = await this.updateAuthorUseCase.execute({ authorId: params.id, data: body })

        if (result.isFailure()) {
          if (result.error.code === AuthorErrors.VALIDATION_ERROR) {
            return reply.status(400).send(this.mapper.mapAuthorValidationError(result.error))
          }
          if (result.error.code === AuthorErrors.NOT_FOUND) {
            return reply.status(404).send(this.mapper.mapAuthorNotFoundError(result.error))
          }
          return reply.status(500).send(ErrorResponsePayload.createInternalServerError())
        }

        const authorDto = AuthorPresenter.create(result.data)

        return reply.status(200).send(new SuccessResponsePayload(authorDto))
      },
    }
  }
}
