import { IsString } from 'class-validator'

export class DeleteAuthorParamDto {
  @IsString()
  id!: string
}
