/** All properties an Author has. */
export interface AuthorProps {
  id: string
  firstName: string
  lastName: string
  birthDate?: Date
  createdAt: Date
  updatedAt: Date
}

/** A snapshot of Author properties. All properties are readonly. */
export class AuthorSnapshot implements Readonly<AuthorProps> {
  readonly id: string
  readonly firstName: string
  readonly lastName: string
  readonly birthDate?: Date | undefined
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(args: AuthorProps) {
    this.id = args.id
    this.firstName = args.firstName
    this.lastName = args.lastName
    this.birthDate = args.birthDate
    this.createdAt = args.createdAt
    this.updatedAt = args.updatedAt
  }
}

/** The properties of an author that can be updated. */
export interface UpdateAuthorProps {
  firstName?: string
  lastName?: string
  birthDate?: Date
}
