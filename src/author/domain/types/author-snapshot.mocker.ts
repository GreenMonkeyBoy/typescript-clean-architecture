import { faker } from '@faker-js/faker'

import { AuthorSnapshot } from './author.types'

export class AuthorSnapshotMocker {
  static create(data?: Partial<AuthorSnapshot>): AuthorSnapshot {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      ...data,
    }
  }
}
