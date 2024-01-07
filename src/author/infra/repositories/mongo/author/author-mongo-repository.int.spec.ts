import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'

import { CONFIG } from '../../../../../config'
import { AuthorEntity } from '../../../../domain/entities/author.entity'
import { AuthorSnapshotMocker } from '../../../../domain/types/author-snapshot.mocker'
import { AuthorMongoModel } from './author.mongo-model'
import { AuthorMongoRepository } from './author.mongo-repository'

describe('INT::AuthorMongoRepository', () => {
  let connection: mongoose.Connection
  let repository: AuthorMongoRepository
  let model: mongoose.Model<AuthorMongoModel>

  const createAuthor = async () => {
    const authorModel = new AuthorMongoModel()
    authorModel._id = faker.string.uuid()
    authorModel.firstName = faker.person.firstName()
    authorModel.lastName = faker.person.lastName()
    authorModel.birthDate = faker.date.past()
    authorModel.createdAt = faker.date.past()
    authorModel.updatedAt = faker.date.past()

    return model.create(authorModel)
  }

  beforeAll(async () => {
    connection = (
      await mongoose.connect(CONFIG.dbUri, { dbName: CONFIG.dbName })
    ).connection
    repository = new AuthorMongoRepository()
    model = connection.model<AuthorMongoModel>('authors')
  })

  beforeEach(async () => {
    await connection.dropDatabase()
  })

  afterAll(async () => {
    await connection.close()
  })

  describe('create', () => {
    it(`should create a author`, async () => {
      // arrange
      const authorSnapshot = AuthorSnapshotMocker.create()

      // act
      await repository.create(authorSnapshot)

      // assert
      const users = await model.find()
      expect(users).toHaveLength(1)
      expect(users[0]._id).toEqual(authorSnapshot.id)
      expect(users[0].firstName).toEqual(authorSnapshot.firstName)
      expect(users[0].lastName).toEqual(authorSnapshot.lastName)
      expect(users[0].birthDate).toEqual(authorSnapshot.birthDate)
      expect(users[0].createdAt).toEqual(authorSnapshot.createdAt)
      expect(users[0].updatedAt).toEqual(authorSnapshot.updatedAt)
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
      const authorModel = new AuthorMongoModel()
      authorModel._id = faker.string.uuid()
      authorModel.firstName = faker.person.firstName()
      authorModel.lastName = faker.person.lastName()
      authorModel.birthDate = faker.date.past()
      authorModel.createdAt = faker.date.past()
      authorModel.updatedAt = faker.date.past()

      await model.create(authorModel)

      // act
      const res = await repository.findById(authorModel._id)

      // assert
      expect(res).toBeInstanceOf(AuthorEntity)
    })
  })

  describe('update', () => {
    it(`should update the author`, async () => {
      // arrange
      const authorModel = await createAuthor()

      const updatedAuthor = AuthorSnapshotMocker.create({
        id: authorModel._id,
        firstName: authorModel.firstName,
      })

      // act
      await repository.update(updatedAuthor)

      // assert
      const doc = await model.findById(authorModel._id)

      expect(doc?.firstName).toEqual(authorModel.firstName)
      expect(doc?.lastName).toEqual(updatedAuthor.lastName)
    })
  })

  describe('delete', () => {
    it(`should delete the author`, async () => {
      // arrange
      const authorModel = await createAuthor()

      // act
      await repository.delete(authorModel._id)

      // assert
      const deletedAuthorModel = await model.findById(authorModel._id)

      expect(deletedAuthorModel).toEqual(null)
    })
  })
})
