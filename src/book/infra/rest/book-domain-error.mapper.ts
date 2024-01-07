import { injectable } from 'inversify'

import { ErrorResponsePayload } from '../../../common/infra/rest/response-payload'
import { BookNotFoundError } from '../../domain/errors/book-not-found.error'
import { BookValidationError } from '../../domain/errors/book-validation.error'

@injectable()
export class BookDomainErrorMapper {
  mapBookNotFoundError(domainError: BookNotFoundError): ErrorResponsePayload {
    return ErrorResponsePayload.create({
      status: 404,
      message: domainError.message,
    })
  }

  mapBookValidationError(
    domainError: BookValidationError,
  ): ErrorResponsePayload {
    return ErrorResponsePayload.create({
      status: 400,
      message: domainError.message,
      description: domainError.description,
    })
  }
}
