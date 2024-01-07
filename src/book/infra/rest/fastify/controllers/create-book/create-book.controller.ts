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
import { CreateBookUseCase } from '../../../../../application/use-cases/create-book/create-book.usecase'
import { BookErrors } from '../../../../../domain/errors/book.errors'
import { BookDomainErrorMapper } from '../../../book-domain-error.mapper'
import { BookPresenter } from '../../../book.presenter'
import { CreateBookBodyDto } from './dto/create-book-body.dto'

@injectable()
export class CreateBookController implements Controller {
  constructor(
    @inject(TYPES.CreateBookUseCase)
    private createBookUseCase: CreateBookUseCase,
    @inject(TYPES.BookDomainErrorMapper)
    private bookDomainErrorMapper: BookDomainErrorMapper,
  ) {}

  get route(): RouteOptions {
    return {
      method: 'POST',
      url: '/books',
      preHandler: async (req, reply) => {
        const requestHandler = new ValidationRequestHandler({
          body: CreateBookBodyDto,
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
        const body = plainToInstance(CreateBookBodyDto, req.body)

        const result = await this.createBookUseCase.execute(body)

        if (result.isFailure()) {
          if (result.error.code === BookErrors.VALIDATION_ERROR) {
            return reply
              .status(400)
              .send(
                this.bookDomainErrorMapper.mapBookValidationError(result.error),
              )
          }
          return reply
            .status(500)
            .send(ErrorResponsePayload.createInternalServerError())
        }

        const bookDto = BookPresenter.create(result.data)

        return reply.status(201).send(new SuccessResponsePayload(bookDto))
      },
    }
  }
}
