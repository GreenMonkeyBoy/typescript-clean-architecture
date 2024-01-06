import { BookSnapshot } from '../../domain/types/book.snapshot'
import { BookDto } from './book.dto'

export class BookPresenter {
  static create(authorSnapshot: BookSnapshot): BookDto {
    return {
      id: authorSnapshot.id,
      title: authorSnapshot.title,
      genre: authorSnapshot.genre,
      isbn: authorSnapshot.isbn,
      releasetAt: authorSnapshot.releasedAt.toISOString(),
    }
  }
}
