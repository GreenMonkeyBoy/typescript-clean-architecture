/** All properties a Book has. */
export interface BookProps {
  id: string
  title: string
  genre: string
  isbn: string
  releasedAt: Date
  authorId: string
}

/** The properties of a book that can be updated. */
export type UpdateBookProps = Partial<Omit<BookProps, 'id'>>
