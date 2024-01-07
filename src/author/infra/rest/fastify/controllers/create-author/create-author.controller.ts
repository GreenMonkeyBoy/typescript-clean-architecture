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
import { CreateAuthorUseCase } from '../../../../../application/use-cases/create-author/create-author.usecase'
import { AuthorErrors } from '../../../../../domain/errors/author.errors'
import { AuthorDomainErrorMapper } from '../../../author-domain-error.mapper'
import { AuthorPresenter } from '../../../author.presenter'
import { CreateAuthorBodyDto } from './dto/create-author-body.dto'

@injectable()
export class CreateAuthorController implements Controller {
  constructor(
    @inject(TYPES.CreateAuthorUseCase)
    private createAuthorUseCase: CreateAuthorUseCase,
    @inject(TYPES.AuthorDomainErrorMapper)
    private authorDomainErrorMapper: AuthorDomainErrorMapper,
  ) {}

  get route(): RouteOptions {
    return {
      method: 'POST',
      url: '/authors',
      preHandler: async (req, reply) => {
        const requestHandler = new ValidationRequestHandler({
          body: CreateAuthorBodyDto,
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
        const body = plainToInstance(CreateAuthorBodyDto, req.body)

        const result = await this.createAuthorUseCase.execute(body)

        if (result.isFailure()) {
          if (result.error.code === AuthorErrors.VALIDATION_ERROR) {
            return reply
              .status(400)
              .send(
                this.authorDomainErrorMapper.mapAuthorValidationError(
                  result.error,
                ),
              )
          }
          return reply
            .status(500)
            .send(ErrorResponsePayload.createInternalServerError())
        }

        const authorDto = AuthorPresenter.create(result.data)

        return reply.status(201).send(new SuccessResponsePayload(authorDto))
      },
    }
  }
}
