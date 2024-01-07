/** Domain-specific error interface. */
export abstract class BaseDomainError<Code extends String> {
  /**
   * Constructs a BaseDomainError.
   *
   * @param code - Unique code for the error
   * @param message - Brief human-readable description of the error
   * @param description - Additional details about the error
   *
   * @example
   * new BaseDomainError('ENTITY_NOT_FOUND', 'Could not find the user in repository')
   * new BaseDomainError('USER.UNAUTHORIZED', 'The user is not authorized', 'The token is encrypted in non-supported format')
   */
  constructor(
    readonly code: Code,
    readonly message: string,
    readonly description?: unknown,
  ) {}
}
