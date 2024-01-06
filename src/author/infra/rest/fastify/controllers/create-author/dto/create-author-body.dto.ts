import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class CreateAuthorBodyDto {
  @IsString()
  firstName!: string

  @IsString()
  lastName!: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date
}
