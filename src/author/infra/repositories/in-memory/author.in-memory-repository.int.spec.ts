import { faker } from '@faker-js/faker'

import { AuthorEntity } from '../../../domain/entities/author.entity'
import { AuthorSnapshotMocker } from '../../../domain/types/author-snapshot.mocker'
import { AuthorInMemoryRepository } from './author.in-memory-repository'

describe('UNIT::AuthorInMemoryRepository', () => {
  let repository: AuthorInMemoryRepository

  beforeAll(async () => {
    repository = new AuthorInMemoryRepository()
  })

  describe('create', () => {
    it(`should add the author in authors`, async () => {
      // arrange
      const authorSnapshot = AuthorSnapshotMocker.create()

      // act
      await repository.create(authorSnapshot)

      // assert
      const author = await repository.findById(authorSnapshot.id)

      expect(author).toBeInstanceOf(AuthorEntity)
    })
  })

  describe('findById', () => {
    it(`when the user is not created, should return null`, async () => {
      // act
      const res = await repository.findById(faker.string.uuid())

      // assert
      expect(res).toEqual(null)
    })

    it(`should return an AuthorEntity`, async () => {
      // arrange
      const authorSnapshot = AuthorSnapshotMocker.create()

      await repository.create(authorSnapshot)

      // act
      const res = await repository.findById(authorSnapshot.id)

      // assert
      expect(res).toBeInstanceOf(AuthorEntity)
    })
  })

  describe('update', () => {
    it(`should update the author`, async () => {
      // arrange
      const authorSnapshotA = AuthorSnapshotMocker.create()
      const authorSnapshotB = AuthorSnapshotMocker.create()

      await repository.create(authorSnapshotA)
      await repository.create(authorSnapshotB)

      const updatedAuthorSnapshotA = AuthorSnapshotMocker.create({
        id: authorSnapshotA.id,
        firstName: authorSnapshotA.firstName,
      })

      // act
      await repository.update(updatedAuthorSnapshotA)

      // assert
      const updatedAuthor = await repository.findById(updatedAuthorSnapshotA.id)
      expect(updatedAuthor?.getSnapshot()).toEqual(updatedAuthor?.getSnapshot())
    })
  })

  describe('delete', () => {
    it(`should remove the author`, async () => {
      // arrange
      const authorSnapshot = AuthorSnapshotMocker.create()

      await repository.create(authorSnapshot)

      // act
      await repository.delete(authorSnapshot.id)

      // assert
      const deleteAuthor = await repository.findById(authorSnapshot.id)
      expect(deleteAuthor).toEqual(null)
    })
  })
})
