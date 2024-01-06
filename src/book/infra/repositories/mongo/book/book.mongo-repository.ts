import { ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { injectable } from 'inversify'

import { BookRepository } from '../../../../application/interfaces/book-repository.interface'
import { BookEntity } from '../../../../domain/entities/book.entity'
import { BookSnapshot } from '../../../../domain/types/book.snapshot'
import { BookMongoModel } from './book.mongo-model'

@injectable()
export class BookMongoRepository implements BookRepository {
  #model: ReturnModelType<typeof BookMongoModel>

  constructor() {
    this.#model = getModelForClass(BookMongoModel, {
      options: { customName: 'books' },
    })
  }

  private convertModelToEntity(model: BookMongoModel) {
    return BookEntity.create({
      id: model._id,
      title: model.title,
      genre: model.genre,
      isbn: model.isbn,
      releasedAt: model.releasedAt,
      authorId: model.authorId,
    })
  }

  async create(bookSnapshot: BookSnapshot) {
    await this.#model.create({ ...bookSnapshot, _id: bookSnapshot.id })
  }

  async findById(bookId: string) {
    const model = await this.#model.findById(bookId).lean().exec()

    if (!model) return null

    return this.convertModelToEntity(model)
  }

  async findByAuthorId(authorId: string) {
    const model = await this.#model.find({ authorId }).lean().exec()

    return model.map((n) => this.convertModelToEntity(n))
  }

  async update(bookSnapshot: BookSnapshot) {
    await this.#model.updateOne({ _id: bookSnapshot.id }, bookSnapshot)
  }

  async delete(bookId: string) {
    await this.#model.deleteOne({ _id: bookId })
  }
}
