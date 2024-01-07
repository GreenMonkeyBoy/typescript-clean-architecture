import { faker } from '@faker-js/faker'
import crypto from 'crypto'

import { EntityValidatorMocker } from '../../../../common/application/interfaces/entity-validator.interface.mocker'
import { BookErrors } from '../../../domain/errors/book.errors'
import { BookEntityValidator } from '../../interfaces/book-entity-validator.interface'
import { BookRepositoryMocker } from '../../interfaces/book-repository-interface.mocker'
import { BookRepository } from '../../interfaces/book-repository.interface'
import { CreateBookCommand } from './create-book.command'
import { CreateBookUseCase } from './create-book.usecase'

class CreateBookCommandMocker {
  static create(data?: Partial<CreateBookCommand>): CreateBookCommand {
    return {
      title: faker.commerce.productName(),
      genre: faker.commerce.productAdjective(),
      isbn: faker.commerce.isbn(),
      releasedAt: faker.date.past(),
      authorId: faker.string.uuid(),
      ...data,
    }
  }
}

describe('UNIT::CreateBookUseCase', () => {
  let bookRepository: BookRepository
  let createBookUseCase: CreateBookUseCase
  let bookEntityValidator: BookEntityValidator

  const createBookUseCaseMocker = (data?: {
    bookRepository?: BookRepository
    bookEntityValidator?: BookEntityValidator
  }): CreateBookUseCase => {
    bookRepository = data?.bookRepository || BookRepositoryMocker.create()
    bookEntityValidator =
      data?.bookEntityValidator || EntityValidatorMocker.create()

    return new CreateBookUseCase(bookRepository, bookEntityValidator)
  }

  beforeEach(() => {
    createBookUseCase = createBookUseCaseMocker()
  })

  it(`when then entity validator returns an error, should return a failure result`, async () => {
    // assert
    jest.spyOn(bookEntityValidator, 'validate').mockReturnValueOnce([])

    // act
    const res = await createBookUseCase.execute(
      CreateBookCommandMocker.create(),
    )

    // assert
    expect(res.isFailure()).toEqual(true)
    expect(res.error?.code).toEqual(BookErrors.VALIDATION_ERROR)
  })

  it(`should create the book in repository`, async () => {
    // arrange
    const id = faker.string.uuid()
    const createBookCommand = CreateBookCommandMocker.create()

    jest.spyOn(crypto, 'randomUUID').mockReturnValueOnce(id as any)

    const create = jest.spyOn(bookRepository, 'create')

    // act
    await createBookUseCase.execute(createBookCommand)

    // assert
    expect(create).toHaveBeenCalledTimes(1)
    expect(create.mock.calls[0][0].id).toEqual(id)
    expect(create.mock.calls[0][0].title).toEqual(createBookCommand.title)
    expect(create.mock.calls[0][0].genre).toEqual(createBookCommand.genre)
    expect(create.mock.calls[0][0].isbn).toEqual(createBookCommand.isbn)
    expect(create.mock.calls[0][0].releasedAt).toEqual(
      createBookCommand.releasedAt,
    )
  })

  it(`should return a success result`, async () => {
    // arrange
    const createBookCommand = CreateBookCommandMocker.create()

    // act
    const res = await createBookUseCase.execute(createBookCommand)

    // assert
    expect(res.isSuccess()).toEqual(true)
  })
})
