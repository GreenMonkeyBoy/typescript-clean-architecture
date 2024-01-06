import { faker } from '@faker-js/faker'

import { AuthorEntity } from '../../domain/entities/author.entity'
import { AuthorRepository } from './author-repository.interface'

export class AuthorRepositoryMocker {
  static create(): AuthorRepository {
    return {
      create() {
        return new Promise((r) => r())
      },
      async findById() {
        return AuthorEntity.create({
          id: faker.string.uuid(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
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
