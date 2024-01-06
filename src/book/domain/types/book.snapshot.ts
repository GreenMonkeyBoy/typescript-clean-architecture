import { BookProps } from './books.types'

/** A snapshot of Book properties. All properties are readonly. */
export class BookSnapshot implements Readonly<BookProps> {
  readonly id!: string
  readonly title!: string
  readonly genre!: string
  readonly isbn!: string
  readonly releasedAt!: Date
  readonly authorId!: string

  constructor(args: BookProps) {
    this.id = args.id
    this.title = args.title
    this.genre = args.genre
    this.isbn = args.isbn
    this.releasedAt = args.releasedAt
    this.authorId = args.authorId
  }
}
