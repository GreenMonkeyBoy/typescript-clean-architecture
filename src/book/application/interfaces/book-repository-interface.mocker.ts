import { faker } from '@faker-js/faker'

import { BookEntity } from '../../domain/entities/book.entity'
import { BookRepository } from './book-repository.interface'

export class BookRepositoryMocker {
  static create(): BookRepository {
    return {
      create() {
        return new Promise((r) => r())
      },
      async findById() {
        return BookEntity.create({
          id: faker.string.uuid(),
          title: faker.commerce.productName(),
          genre: faker.commerce.productAdjective(),
          isbn: faker.commerce.isbn(),
          releasedAt: faker.date.past(),
          authorId: faker.string.uuid(),
        })
      },
      update() {
        return new Promise((r) => r())
      },
      delete() {
        return new Promise((r) => r())
      },
    }
  }
}
