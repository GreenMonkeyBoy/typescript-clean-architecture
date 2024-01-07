import { BaseDomainError } from '../../../common/domain/errors/base-domain-error'
import { AuthorErrors } from './author.errors'

/** Represents an error when the requested author was not found. */
export class AuthorNotFoundError extends BaseDomainError<AuthorErrors.NOT_FOUND> {
  constructor(authorId: string) {
    super(AuthorErrors.NOT_FOUND, `Could not find the author`, { authorId })
  }
}
