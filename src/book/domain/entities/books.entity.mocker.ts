import { faker } from '@faker-js/faker'

import { BookProps } from '../types/books.types'
import { BookEntity } from './book.entity'

export class BookEntityMocker {
  static create(data?: Partial<BookProps>): BookEntity {
    return BookEntity.create({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      genre: faker.commerce.productAdjective(),
      isbn: faker.commerce.isbn(),
      releasedAt: faker.date.past(),
      authorId: faker.string.uuid(),
      ...data,
    })
  }
}
