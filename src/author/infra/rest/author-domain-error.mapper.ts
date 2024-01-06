import { injectable } from 'inversify'

import { ErrorResponsePayload } from '../../../common/infra/rest/response-payload'
import { AuthorNotFoundError } from '../../domain/errors/author-not-found.error'
import { AuthorValidationError } from '../../domain/errors/author-validation.error'

@injectable()
export class AuthorDomainErrorMapper {
  mapAuthorNotFoundError(domainError: AuthorNotFoundError): ErrorResponsePayload {
    return ErrorResponsePayload.create({
      status: 404,
      message: domainError.message,
    })
  }

  mapAuthorValidationError(domainError: AuthorValidationError): ErrorResponsePayload {
    return ErrorResponsePayload.create({
      status: 400,
      message: domainError.message,
      description: domainError.description,
    })
  }
}
