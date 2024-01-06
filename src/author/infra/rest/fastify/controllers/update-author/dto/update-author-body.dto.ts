import { Type } from 'class-transformer'
import { IsDate, IsOptional, IsString } from 'class-validator'

export class UpdateAuthorBodyDto {
  @IsString()
  @IsOptional()
  firstName!: string

  @IsString()
  @IsOptional()
  lastName!: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthDate?: Date
}
