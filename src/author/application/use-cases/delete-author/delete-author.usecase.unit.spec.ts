import { faker } from '@faker-js/faker'

import { AuthorRepositoryMocker } from '../../interfaces/author-repository-interface.mocker'
import { AuthorRepository } from '../../interfaces/author-repository.interface'
import { DeleteAuthorUseCase } from './delete-author.usecase'

describe('UNIT::DeleteAuthorUseCase', () => {
  let authorRepository: AuthorRepository
  let deleteAuthorUseCase: DeleteAuthorUseCase

  const deleteAuthorUseCaseMocker = (data?: {
    authorRepository?: AuthorRepository
  }): DeleteAuthorUseCase => {
    authorRepository = data?.authorRepository || AuthorRepositoryMocker.create()

    return new DeleteAuthorUseCase(authorRepository)
  }

  beforeEach(() => {
    deleteAuthorUseCase = deleteAuthorUseCaseMocker()
  })

  it(`should delete the author in repository`, async () => {
    // arrange
    const authorId = faker.string.uuid()
    const deleteAuthor = jest.spyOn(authorRepository, 'delete')

    // act
    await deleteAuthorUseCase.execute(authorId)

    // assert
    expect(deleteAuthor).toHaveBeenCalledTimes(1)
    expect(deleteAuthor.mock.calls[0][0]).toEqual(authorId)
  })

  it(`should return a success result`, async () => {
    // arrange
    const authorId = faker.string.uuid()

    // act
    const res = await deleteAuthorUseCase.execute(authorId)

    // assert
    expect(res.isSuccess()).toEqual(true)
  })
})
