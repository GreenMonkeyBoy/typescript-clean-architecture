import { AuthorEntity } from '../../domain/entities/author.entity'
import { AuthorSnapshot } from '../../domain/types/author.types'

export interface AuthorRepository {
  create(authorSnapshot: AuthorSnapshot): Promise<void>
  findById(authorId: string): Promise<AuthorEntity | null>
  update(authorSnapshot: AuthorSnapshot): Promise<void>
  delete(authorId: string): Promise<void>
}
