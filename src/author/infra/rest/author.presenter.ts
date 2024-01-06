import { AuthorSnapshot } from '../../domain/types/author.types'
import { AuthorDto } from './author.dto'

export class AuthorPresenter {
  static create(authorSnapshot: AuthorSnapshot): AuthorDto {
    return {
      id: authorSnapshot.id,
      firstName: authorSnapshot.firstName,
      lastName: authorSnapshot.lastName,
      createdAt: authorSnapshot.createdAt.toISOString(),
    }
  }
}
