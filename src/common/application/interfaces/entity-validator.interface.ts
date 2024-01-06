import { EntityValidationError } from '../types/entity-validation-error'

export interface EntityValidator<T> {
  validate(entity: T): null | EntityValidationError[]
}
