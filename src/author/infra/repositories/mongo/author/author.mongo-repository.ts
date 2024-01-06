import { ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { injectable } from 'inversify'

import { AuthorRepository } from '../../../../application/interfaces/author-repository.interface'
import { AuthorEntity } from '../../../../domain/entities/author.entity'
import { AuthorSnapshot } from '../../../../domain/types/author.types'
import { AuthorMongoModel } from './author.mongo-model'

@injectable()
export class AuthorMongoRepository implements AuthorRepository {
  #model: ReturnModelType<typeof AuthorMongoModel>

  constructor() {
    this.#model = getModelForClass(AuthorMongoModel, {
      options: { customName: 'authors' },
    })
  }

  private convertModelToEntity(model: AuthorMongoModel) {
    return AuthorEntity.create({
      id: model._id,
      firstName: model.firstName,
      lastName: model.lastName,
      birthDate: model.birthDate,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    })
  }

  async create(authorSnapshot: AuthorSnapshot) {
    await this.#model.create({ ...authorSnapshot, _id: authorSnapshot.id })
  }

  async findById(authorId: string) {
    const model = await this.#model.findById(authorId).lean().exec()

    if (!model) return null

    return this.convertModelToEntity(model)
  }

  async update(authorSnapshot: AuthorSnapshot) {
    await this.#model.updateOne({ _id: authorSnapshot.id }, authorSnapshot)
  }

  async delete(authorId: string) {
    await this.#model.deleteOne({ _id: authorId })
  }
}
