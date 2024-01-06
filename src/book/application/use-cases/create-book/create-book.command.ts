export interface CreateBookCommand {
  title: string
  genre: string
  isbn: string
  releasedAt: Date
  authorId: string
}
