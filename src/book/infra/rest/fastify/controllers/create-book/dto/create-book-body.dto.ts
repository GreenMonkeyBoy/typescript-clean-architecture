import { Type } from 'class-transformer'
import { IsDate, IsISBN, IsString } from 'class-validator'

export class CreateBookBodyDto {
  @IsString()
  title!: string

  @IsString()
  genre!: string

  @IsISBN()
  isbn!: string

  @IsDate()
  @Type(() => Date)
  releasedAt!: Date

  @IsString()
  authorId!: string
}
