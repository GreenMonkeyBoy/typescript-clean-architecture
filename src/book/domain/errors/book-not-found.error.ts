import { BaseDomainError } from "../../../common/domain/errors/base-domain-error";
import { BookErrors } from "./book.errors";

/** Represents an error when the requested book was not found. */
export class BookNotFoundError extends BaseDomainError<BookErrors.NOT_FOUND> {
  constructor(bookId: string) {
    super(BookErrors.NOT_FOUND, `Could not find the book`, { bookId });
  }
}
