import { BookEntity } from '../../domain/entities/book.entity'
import { BookSnapshot } from '../../domain/types/book.snapshot'

export interface BookRepository {
  create(bookSnapshot: BookSnapshot): Promise<void>
  findById(bookId: string): Promise<BookEntity | null>
  update(bookSnapshot: BookSnapshot): Promise<void>
  delete(bookId: string): Promise<void>
}
