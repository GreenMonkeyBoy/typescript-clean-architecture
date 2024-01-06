export interface ValidationError {
  /**
   * Property that haven't pass validation.
   *
   * @example 'firstName'
   */
  property: string

  /**
   * Value that haven't pass a validation.
   *
   * @example 'Aurore'
   */
  value: unknown

  /**
   * Constraints that failed validation with error messages.
   *
   * @example
   * {
   *  minLength: 'The value must be longer than 10 characters'
   * }
   */
  constraints?: {
    [type: string]: string
  }
}
