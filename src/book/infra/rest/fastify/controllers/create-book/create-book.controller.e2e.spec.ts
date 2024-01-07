import { faker } from '@faker-js/faker'
import request from 'supertest'

import { App } from '../../../../../../app'
import { TYPES } from '../../../../../../common/infra/ioc/types'
import { FastifyServer } from '../../../../../../common/infra/rest/fastify/fastify-server'
import { BookRepository } from '../../../../../application/interfaces/book-repository.interface'
import { BookDto } from '../../../book.dto'
import { CreateBookBodyDto } from './dto/create-book-body.dto'

class CreateBookBodyDtoMocker {
  static create(data?: Partial<CreateBookBodyDtoMocker>): CreateBookBodyDto {
    return {
      title: faker.commerce.productName(),
      genre: faker.commerce.productAdjective(),
      isbn: faker.commerce.isbn(),
      releasedAt: faker.date.past(),
      authorId: faker.string.uuid(),
      ...data,
    }
  }
}

describe('E2E::CreateAuthorController', () => {
  let app: App
  let bookRepository: BookRepository
  let fastifyServer: FastifyServer

  const method = 'post'
  const route = () => '/books'

  beforeAll(async () => {
    app = await App.createTestApp()

    fastifyServer = app.get<FastifyServer>(TYPES.FastifyServer)
    bookRepository = app.get<BookRepository>(TYPES.BookRepository)
  })

  afterEach(async () => {
    await app.clearDatabase()
  })

  afterAll(async () => {
    await app.destroy()
  })

  it(`when the body is missing, should return 400`, async () => {
    // act
    const res = await request(fastifyServer.server)[method](route())

    // assert
    expect(res.status).toEqual(400)
    expect(res.body.error.message).toEqual(`The request must include a body`)
  })

  it(`when the body is invalid, should return a 400`, async () => {
    // act
    const res = await request(fastifyServer.server)[method](route()).send({})

    // assert
    expect(res.status).toEqual(400)
    expect(res.body.error).toBeDefined()
  })

  it(`when the 'Authorization' header is not defined, should return a 401`, async () => {
    // arrange
    const body = CreateBookBodyDtoMocker.create()

    // act
    const res = await request(fastifyServer.server)[method](route()).send(body)

    // assert
    expect(res.status).toEqual(401)
    expect(res.body.error).toBeDefined()
  })

  it(`when the repository throws an unexpected error, should return a 500 response`, async () => {
    // arrange
    const body = CreateBookBodyDtoMocker.create()

    jest.spyOn(bookRepository, 'create').mockImplementationOnce(() => {
      throw new Error(faker.lorem.words())
    })

    // act
    const res = await request(fastifyServer.server)
      [method](route())
      .send(body)
      .set('Authorization', 'token')

    // assert
    expect(res.status).toEqual(500)
    expect(res.body.error.message).toEqual(`Internal Server Error`)
  })

  it(`should return a 201`, async () => {
    // arrange
    const body = CreateBookBodyDtoMocker.create()

    // act
    const res = await request(fastifyServer.server)
      [method](route())
      .send(body)
      .set('Authorization', 'token')

    // assert
    expect(res.status).toEqual(201)
    expect(res.body.data).toEqual<BookDto>({
      id: expect.any(String),
      title: body.title,
      genre: body.genre,
      isbn: body.isbn,
      releasetAt: body.releasedAt.toISOString(),
    })
  })
})
