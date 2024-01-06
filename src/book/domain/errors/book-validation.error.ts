import { EntityValidationError } from '../../../common/application/types/entity-validation-error'
import { BaseDomainError } from '../../../common/domain/errors/base-domain-error'
import { BookErrors } from './book.errors'

/** Represents an error when the book entity is not valid. */
export class BookValidationError extends BaseDomainError<BookErrors.VALIDATION_ERROR> {
  constructor(validationErrors: EntityValidationError[]) {
    super(BookErrors.VALIDATION_ERROR, `The book entity is invalid`, validationErrors)
  }
}
