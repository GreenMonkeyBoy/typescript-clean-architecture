import { inject, injectable } from 'inversify'

import { UseCase } from '../../../../common/application/types/use-case'
import { ResultSuccess } from '../../../../common/domain/results/result'
import { TYPES } from '../../../../common/infra/ioc/types'
import { AuthorRepository } from '../../interfaces/author-repository.interface'

@injectable()
export class DeleteAuthorUseCase implements UseCase<void> {
  constructor(@inject(TYPES.AuthorRepository) private authorRepository: AuthorRepository) {}

  async execute(authorId: string) {
    await this.authorRepository.delete(authorId)

    return new ResultSuccess(undefined)
  }
}
