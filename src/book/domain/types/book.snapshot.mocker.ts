import { faker } from '@faker-js/faker'

import { BookSnapshot } from './book.snapshot'

export class BookSnapshotMocker {
  static create(data?: Partial<BookSnapshot>): BookSnapshot {
    return {
      id: faker.string.uuid(),
      title: faker.commerce.product(),
      genre: faker.commerce.productAdjective(),
      isbn: faker.commerce.isbn(),
      releasedAt: faker.date.past(),
      authorId: faker.string.uuid(),
      ...data,
    }
  }
}
