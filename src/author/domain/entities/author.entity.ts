import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
  MinLength,
} from 'class-validator'

import {
  AuthorProps,
  AuthorSnapshot,
  UpdateAuthorProps,
} from '../types/author.types'

export class AuthorEntity {
  @IsUUID('4')
  private id: string

  @IsString()
  @MinLength(2)
  private firstName: string

  @IsString()
  @MinLength(2)
  private lastName: string

  @IsDate()
  @IsOptional()
  @MinDate(new Date('1900-01-01T00:00:00.000Z'))
  private birthDate?: Date

  @IsDate()
  private createdAt: Date

  @IsDate()
  private updatedAt: Date

  private constructor(props: AuthorProps) {
    this.id = props.id
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.birthDate = props.birthDate
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static create(data: AuthorProps): AuthorEntity {
    return new AuthorEntity(data)
  }

  update(data: UpdateAuthorProps): AuthorEntity {
    if (data.firstName) {
      this.firstName = data.firstName
    }
    if (data.lastName) {
      this.lastName = data.lastName
    }
    if (data.birthDate) {
      this.birthDate = data.birthDate
    }

    this.updatedAt = new Date()

    return this
  }

  getSnapshot(): AuthorSnapshot {
    return new AuthorSnapshot({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    })
  }
}
