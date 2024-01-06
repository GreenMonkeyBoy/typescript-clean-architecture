import { IsString } from 'class-validator'

export class FindAuthorParamDto {
  @IsString()
  id!: string
}
