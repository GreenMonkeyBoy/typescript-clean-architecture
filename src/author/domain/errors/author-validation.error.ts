import { EntityValidationError } from '../../../common/application/types/entity-validation-error'
import { BaseDomainError } from '../../../common/domain/errors/base-domain-error'
import { AuthorErrors } from './author.errors'

/** Represents an error when the author entity is not valid. */
export class AuthorValidationError extends BaseDomainError<AuthorErrors.VALIDATION_ERROR> {
  constructor(validationErrors: EntityValidationError[]) {
    super(
      AuthorErrors.VALIDATION_ERROR,
      `The author entity is invalid`,
      validationErrors,
    )
  }
}
