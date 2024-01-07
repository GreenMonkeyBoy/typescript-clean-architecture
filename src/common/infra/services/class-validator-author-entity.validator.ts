import { validateSync } from 'class-validator'
import { injectable } from 'inversify'

import { EntityValidator } from '../../application/interfaces/entity-validator.interface'
import { EntityValidationError } from '../../application/types/entity-validation-error'

@injectable()
export class ClassValidatorEntityValidator<T extends object>
  implements EntityValidator<T>
{
  validate(entity: T) {
    const errors = validateSync(entity)

    if (errors.length === 0) return null

    return errors.map<EntityValidationError>((n) => ({
      property: n.property,
      value: n.value,
      constraints: n.constraints,
    }))
  }
}
