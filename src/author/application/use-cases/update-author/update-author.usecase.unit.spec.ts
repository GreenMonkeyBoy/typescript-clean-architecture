import { faker } from '@faker-js/faker'

import { EntityValidatorMocker } from '../../../../common/application/interfaces/entity-validator.interface.mocker'
import { AuthorEntityMocker } from '../../../domain/entities/author.entity.mocker'
import { AuthorErrors } from '../../../domain/errors/author.errors'
import { AuthorEntityValidator } from '../../interfaces/author-entity-validator.interface'
import { AuthorRepositoryMocker } from '../../interfaces/author-repository-interface.mocker'
import { AuthorRepository } from '../../interfaces/author-repository.interface'
import { UpdateAuthorCommand } from './update-author.command'
import { UpdateAuthorUseCase } from './update-author.usecase'

class UpdateAuthorCommandMocker {
  static create(data?: Partial<UpdateAuthorCommand>): UpdateAuthorCommand {
    return {
      authorId: faker.string.uuid(),
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthDate: faker.date.past(),
      },
      ...data,
    }
  }
}

describe('UNIT::UpdateAuthorUseCase', () => {
  let authorRepository: AuthorRepository
  let updateAuthorUseCase: UpdateAuthorUseCase
  let authorEntityValidator: AuthorEntityValidator

  const updateAuthorUseCaseMocker = (data?: {
    authorRepository?: AuthorRepository
    authorEntityValidator?: AuthorEntityValidator
  }): UpdateAuthorUseCase => {
    authorRepository = data?.authorRepository || AuthorRepositoryMocker.create()
    authorEntityValidator =
      data?.authorEntityValidator || EntityValidatorMocker.create()

    return new UpdateAuthorUseCase(authorRepository, authorEntityValidator)
  }

  beforeEach(() => {
    updateAuthorUseCase = updateAuthorUseCaseMocker()
  })

  it(`should find the author in repository`, async () => {
    // arrange
    const command = UpdateAuthorCommandMocker.create()

    const findById = jest.spyOn(authorRepository, 'findById')

    // act
    await updateAuthorUseCase.execute(command)

    // assert
    expect(findById).toHaveBeenCalledTimes(1)
    expect(findById.mock.calls[0][0]).toEqual(command.authorId)
  })

  it(`when the author is not in repository, should return a failure result`, async () => {
    // arrange
    const command = UpdateAuthorCommandMocker.create()

    jest.spyOn(authorRepository, 'findById').mockResolvedValueOnce(null)

    // act
    const res = await updateAuthorUseCase.execute(command)

    // assert
    expect(res.isFailure()).toEqual(true)
  })

  it(`when then entity validator returns an error, should return a failure result`, async () => {
    // arrange
    const command = UpdateAuthorCommandMocker.create()
    jest.spyOn(authorEntityValidator, 'validate').mockReturnValueOnce([])

    // act
    const res = await updateAuthorUseCase.execute(command)

    // assert
    expect(res.isFailure()).toEqual(true)
    expect(res.error?.code).toEqual(AuthorErrors.VALIDATION_ERROR)
  })

  it(`should update the author in repository`, async () => {
    // arrange
    const createAuthorCommand = UpdateAuthorCommandMocker.create()

    const authorEntity = AuthorEntityMocker.create()

    jest.spyOn(authorRepository, 'findById').mockResolvedValueOnce(authorEntity)

    const updateAuthor = jest.spyOn(authorRepository, 'update')

    // act
    await updateAuthorUseCase.execute(createAuthorCommand)

    // assert
    expect(updateAuthor).toHaveBeenCalledTimes(1)
    expect(updateAuthor.mock.calls[0][0].id).toEqual(
      authorEntity.getSnapshot().id,
    )
    expect(updateAuthor.mock.calls[0][0].firstName).toEqual(
      createAuthorCommand.data.firstName,
    )
    expect(updateAuthor.mock.calls[0][0].lastName).toEqual(
      createAuthorCommand.data.lastName,
    )
    expect(updateAuthor.mock.calls[0][0].birthDate).toEqual(
      createAuthorCommand.data.birthDate,
    )
    expect(updateAuthor.mock.calls[0][0].createdAt).toEqual(
      authorEntity.getSnapshot().createdAt,
    )
    expect(updateAuthor.mock.calls[0][0].updatedAt.getTime()).toBeCloseTo(
      new Date().getTime(),
      -3,
    )
  })

  it(`should return a success result`, async () => {
    // arrange
    const createAuthorCommand = UpdateAuthorCommandMocker.create()

    const authorEntity = AuthorEntityMocker.create()

    jest.spyOn(authorRepository, 'findById').mockResolvedValueOnce(authorEntity)

    jest.spyOn(authorRepository, 'update').mockResolvedValueOnce()

    // act
    const res = await updateAuthorUseCase.execute(createAuthorCommand)

    // assert
    expect(res.isSuccess()).toEqual(true)
  })
})
