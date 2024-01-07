import { inject, injectable } from 'inversify'

import { UseCase } from '../../../../common/application/types/use-case'
import {
  ResultFailure,
  ResultSuccess,
} from '../../../../common/domain/results/result'
import { TYPES } from '../../../../common/infra/ioc/types'
import { AuthorNotFoundError } from '../../../domain/errors/author-not-found.error'
import { AuthorSnapshot } from '../../../domain/types/author.types'
import { AuthorRepository } from '../../interfaces/author-repository.interface'

@injectable()
export class FindAuthorUseCase
  implements UseCase<AuthorSnapshot, AuthorNotFoundError>
{
  constructor(
    @inject(TYPES.AuthorRepository) private authorRepository: AuthorRepository,
  ) {}

  async execute(authorId: string) {
    const authorEntity = await this.authorRepository.findById(authorId)

    if (!authorEntity) {
      return new ResultFailure(new AuthorNotFoundError(authorId))
    }

    return new ResultSuccess(authorEntity.getSnapshot())
  }
}
