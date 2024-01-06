import { faker } from '@faker-js/faker'

import { AuthorProps } from '../types/author.types'
import { AuthorEntity } from './author.entity'

export class AuthorEntityMocker {
  static create(data?: Partial<AuthorProps>): AuthorEntity {
    return AuthorEntity.create({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.past(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      ...data,
    })
  }
}
