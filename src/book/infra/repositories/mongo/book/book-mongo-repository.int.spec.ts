import { faker } from '@faker-js/faker'
import * as mongoosea from 'mongoose'

import { CONFIG } from '../../../../../config'
import { BookEntity } from '../../../../domain/entities/book.entity'
import { BookSnapshotMocker } from '../../../../domain/types/book.snapshot.mocker'
import { BookMongoModel } from './book.mongo-model'
import { BookMongoRepository } from './book.mongo-repository'

describe('INT::BookMongoRepository', () => {
  let mongoose: mongoosea.Connection
  let repository: BookMongoRepository
  let model: mongoosea.Model<BookMongoModel>

  const createBook = async () => {
    const bookModel = new BookMongoModel()
    bookModel._id = faker.string.uuid()
    bookModel.title = faker.commerce.productName()
    bookModel.genre = faker.commerce.productAdjective()
    bookModel.isbn = faker.commerce.isbn()
    bookModel.releasedAt = faker.date.past()

    return model.create(bookModel)
  }

  beforeAll(async () => {
    mongoose = (
      await mongoosea.connect(CONFIG.dbUri, { dbName: CONFIG.dbName })
    ).connection
    repository = new BookMongoRepository()
    model = mongoose.model<BookMongoModel>('books')
  })

  beforeEach(async () => {
    await mongoose.dropDatabase()
  })

  afterAll(async () => {
    await mongoose.close()
  })

  describe('create', () => {
    it(`should create a book`, async () => {
      // arrange
      const bookSnapshot = BookSnapshotMocker.create()

      // act
      await repository.create(bookSnapshot)

      // assert
      const users = await model.find()
      expect(users).toHaveLength(1)
      expect(users[0]._id).toEqual(bookSnapshot.id)
      expect(users[0].title).toEqual(bookSnapshot.title)
      expect(users[0].genre).toEqual(bookSnapshot.genre)
      expect(users[0].isbn).toEqual(bookSnapshot.isbn)
      expect(users[0].releasedAt).toEqual(bookSnapshot.releasedAt)
    })
  })

  describe('findById', () => {
    it(`when the user is not created, should return null`, async () => {
      // act
      const res = await repository.findById(faker.string.uuid())

      // assert
      expect(res).toEqual(null)
    })

    it(`should return an BookEntity`, async () => {
      // arrange
      const bookModel = new BookMongoModel()
      bookModel._id = faker.string.uuid()
      bookModel.title = faker.commerce.productName()
      bookModel.genre = faker.commerce.productAdjective()
      bookModel.isbn = faker.commerce.isbn()
      bookModel.releasedAt = faker.date.past()

      await model.create(bookModel)

      // act
      const res = await repository.findById(bookModel._id)

      // assert
      expect(res).toBeInstanceOf(BookEntity)
    })
  })

  describe('update', () => {
    it(`should update the book`, async () => {
      // arrange
      const bookModel = await createBook()

      const updatedBook = BookSnapshotMocker.create({
        id: bookModel._id,
        title: bookModel.title,
      })

      // act
      await repository.update(updatedBook)

      // assert
      const doc = await model.findById(bookModel._id)

      expect(doc?.title).toEqual(bookModel.title)
      expect(doc?.genre).toEqual(updatedBook.genre)
    })
  })

  describe('delete', () => {
    it(`should delete the book`, async () => {
      // arrange
      const bookModel = await createBook()

      // act
      await repository.delete(bookModel._id)

      // assert
      const deletedBookModel = await model.findById(bookModel._id)

      expect(deletedBookModel).toEqual(null)
    })
  })
})
