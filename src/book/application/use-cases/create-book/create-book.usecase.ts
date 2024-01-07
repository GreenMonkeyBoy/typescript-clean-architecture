import crypto from 'crypto'
import { inject, injectable } from 'inversify'

import { UseCase } from '../../../../common/application/types/use-case'
import {
  ResultFailure,
  ResultSuccess,
} from '../../../../common/domain/results/result'
import { TYPES } from '../../../../common/infra/ioc/types'
import { BookEntity } from '../../../domain/entities/book.entity'
import { BookValidationError } from '../../../domain/errors/book-validation.error'
import { BookSnapshot } from '../../../domain/types/book.snapshot'
import { BookEntityValidator } from '../../interfaces/book-entity-validator.interface'
import { BookRepository } from '../../interfaces/book-repository.interface'
import { CreateBookCommand } from './create-book.command'

@injectable()
export class CreateBookUseCase
  implements UseCase<BookSnapshot, BookValidationError>
{
  constructor(
    @inject(TYPES.BookRepository) private bookRepository: BookRepository,
    @inject(TYPES.EntityValidator)
    private bookEntityValidator: BookEntityValidator,
  ) {}

  async execute(command: CreateBookCommand) {
    const bookEntity = BookEntity.create({
      id: crypto.randomUUID(),
      title: command.title,
      genre: command.genre,
      isbn: command.isbn,
      releasedAt: command.releasedAt,
      authorId: command.authorId,
    })

    const validationErrors = this.bookEntityValidator.validate(bookEntity)

    if (validationErrors) {
      return new ResultFailure(new BookValidationError(validationErrors))
    }

    await this.bookRepository.create(bookEntity.getSnapshot())

    return new ResultSuccess(bookEntity.getSnapshot())
  }
}
