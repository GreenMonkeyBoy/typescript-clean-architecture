import { Severity, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class BookMongoModel {
  @prop()
  _id!: string

  @prop()
  title!: string

  @prop()
  genre!: string

  @prop()
  isbn!: string

  @prop()
  releasedAt!: Date

  @prop()
  authorId!: string
}
