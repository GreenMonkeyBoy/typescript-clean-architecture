import { EntityValidator } from './entity-validator.interface'

export class EntityValidatorMocker {
  static create(): EntityValidator<unknown> {
    return {
      validate() {
        return null
      },
    }
  }
}
