import { IsString } from 'class-validator'

export class UpdateAuthorParamDto {
  @IsString()
  id!: string
}
