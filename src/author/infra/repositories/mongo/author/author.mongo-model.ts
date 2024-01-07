import { Severity, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class AuthorMongoModel {
  @prop()
  _id!: string

  @prop()
  firstName!: string

  @prop()
  lastName!: string

  @prop()
  birthDate!: Date

  @prop()
  createdAt!: Date

  @prop()
  updatedAt!: Date
}
