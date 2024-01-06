import { IsDate, IsISBN, IsString, IsUUID, MinDate, MinLength } from 'class-validator'

import { BookSnapshot } from '../types/book.snapshot'
import { BookProps, UpdateBookProps } from '../types/books.types'

export class BookEntity {
  @IsUUID('4')
  private id: string

  @IsString()
  @MinLength(2)
  private title: string

  @IsString()
  @MinLength(2)
  private genre: string

  @IsISBN()
  private isbn: string

  @IsDate()
  @MinDate(new Date('1900-01-01T00:00:00.000Z'))
  private releasedAt: Date

  @IsString()
  authorId!: string

  private constructor(props: BookProps) {
    this.id = props.id
    this.title = props.title
    this.genre = props.genre
    this.isbn = props.isbn
    this.releasedAt = props.releasedAt
    this.authorId = props.authorId
  }

  static create(data: BookProps): BookEntity {
    return new BookEntity(data)
  }

  update(data: UpdateBookProps): BookEntity {
    if (data.title) {
      this.title = data.title
    }
    if (data.genre) {
      this.genre = data.genre
    }
    if (data.isbn) {
      this.isbn = data.isbn
    }
    if (data.releasedAt) {
      this.releasedAt = data.releasedAt
    }
    if (data.authorId) {
      this.authorId = data.authorId
    }

    return this
  }

  getSnapshot(): BookSnapshot {
    return new BookSnapshot({
      id: this.id,
      title: this.title,
      genre: this.genre,
      isbn: this.isbn,
      releasedAt: this.releasedAt,
      authorId: this.authorId,
    })
  }
}
