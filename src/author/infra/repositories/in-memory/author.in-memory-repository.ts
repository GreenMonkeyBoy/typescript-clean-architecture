import { AuthorRepository } from '../../../application/interfaces/author-repository.interface'
import { AuthorEntity } from '../../../domain/entities/author.entity'
import { AuthorSnapshot } from '../../../domain/types/author.types'

export class AuthorInMemoryRepository implements AuthorRepository {
  #authors: AuthorSnapshot[] = []

  private convertModelToEntity(model: AuthorSnapshot) {
    return AuthorEntity.create({
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      birthDate: model.birthDate,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    })
  }

  create(authorSnapshot: AuthorSnapshot) {
    return new Promise<void>((resolve) => {
      this.#authors.push(authorSnapshot)
      resolve()
    })
  }

  findById(authorId: string) {
    return new Promise<AuthorEntity | null>(async (resolve) => {
      const author = this.#authors.find((n) => n.id === authorId)

      if (!author) {
        return resolve(null)
      }

      return resolve(this.convertModelToEntity(author))
    })
  }

  update(authorSnapshot: AuthorSnapshot) {
    return new Promise<void>((resolve) => {
      const author = this.#authors.find((n) => n.id === authorSnapshot.id)

      if (!author) return

      this.#authors = this.#authors.filter((n) => n.id !== authorSnapshot.id)
      this.#authors.push(authorSnapshot)

      resolve(undefined)
    })
  }

  delete(authorId: string) {
    return new Promise<void>((resolve) => {
      this.#authors = this.#authors.filter((n) => n.id !== authorId)
      resolve(undefined)
    })
  }
}
