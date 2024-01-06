import { inject, injectable } from 'inversify'

import { UseCase } from '../../../../common/application/types/use-case'
import { ResultFailure, ResultSuccess } from '../../../../common/domain/results/result'
import { TYPES } from '../../../../common/infra/ioc/types'
import { AuthorNotFoundError } from '../../../domain/errors/author-not-found.error'
import { AuthorValidationError } from '../../../domain/errors/author-validation.error'
import { AuthorSnapshot } from '../../../domain/types/author.types'
import { AuthorEntityValidator } from '../../interfaces/author-entity-validator.interface'
import { AuthorRepository } from '../../interfaces/author-repository.interface'
import { UpdateAuthorCommand } from './update-author.command'

@injectable()
export class UpdateAuthorUseCase
  implements UseCase<AuthorSnapshot, AuthorNotFoundError | AuthorValidationError>
{
  constructor(
    @inject(TYPES.AuthorRepository) private authorRepository: AuthorRepository,
    @inject(TYPES.EntityValidator)
    private authorEntityValidator: AuthorEntityValidator
  ) {}

  async execute(command: UpdateAuthorCommand) {
    const authorEntity = await this.authorRepository.findById(command.authorId)

    if (!authorEntity) {
      return new ResultFailure(new AuthorNotFoundError(command.authorId))
    }

    const updatedAuthorEntity = authorEntity.update({ ...command.data })

    const validationErrors = this.authorEntityValidator.validate(updatedAuthorEntity)

    if (validationErrors) {
      return new ResultFailure(new AuthorValidationError(validationErrors))
    }

    await this.authorRepository.update(updatedAuthorEntity.getSnapshot())

    return new ResultSuccess(updatedAuthorEntity.getSnapshot())
  }
}
