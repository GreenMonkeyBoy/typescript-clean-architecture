import { faker } from '@faker-js/faker'
import request from 'supertest'

import { App } from '../../../../../../app'
import { BookRepository } from '../../../../../../book/application/interfaces/book-repository.interface'
import { BookSnapshotMocker } from '../../../../../../book/domain/types/book.snapshot.mocker'
import { TYPES } from '../../../../../../common/infra/ioc/types'
import { FastifyServer } from '../../../../../../common/infra/rest/fastify/fastify-server'
import { AuthorRepository } from '../../../../../application/interfaces/author-repository.interface'
import { AuthorSnapshotMocker } from '../../../../../domain/types/author-snapshot.mocker'
import { AuthorDto } from '../../../author.dto'
import { UpdateAuthorBodyDto } from './dto/update-author-body.dto'

class UpdateAuthorBodyDtoMocker {
  static create(data?: Partial<UpdateAuthorBodyDto>): UpdateAuthorBodyDto {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.past(),
      ...data,
    }
  }
}

describe('E2E::UpdateAuthorController', () => {
  let app: App
  let authorRepository: AuthorRepository
  let bookRepository: BookRepository
  let fastifyServer: FastifyServer

  const method = 'patch'
  const route = (id?: string) => `/authors/${id || faker.string.uuid()}`

  beforeAll(async () => {
    app = await App.createTestApp()

    fastifyServer = app.get<FastifyServer>(TYPES.FastifyServer)
    authorRepository = app.get<AuthorRepository>(TYPES.AuthorRepository)
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

  it(`when the 'Authorization' header is not defined, should return a 401`, async () => {
    // arrange
    const body = UpdateAuthorBodyDtoMocker.create()

    // act
    const res = await request(fastifyServer.server)[method](route()).send(body)

    // assert
    expect(res.status).toEqual(401)
    expect(res.body.error).toBeDefined()
  })

  it(`when the repository throws an unexpected error, should return a 500 response`, async () => {
    // arrange
    const body = UpdateAuthorBodyDtoMocker.create()

    jest.spyOn(authorRepository, 'findById').mockImplementationOnce(() => {
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

  it(`when the firstName has 1 character, should return 400`, async () => {
    // arrange
    const authorSnapshot = AuthorSnapshotMocker.create()

    await authorRepository.create(authorSnapshot)

    const body = UpdateAuthorBodyDtoMocker.create({ firstName: 'a' })

    // act
    const res = await request(fastifyServer.server)
      [method](route(authorSnapshot.id))
      .send(body)
      .set('Authorization', 'token')

    // assert
    expect(res.status).toEqual(400)
  })

  it(`should return a 200`, async () => {
    // arrange
    const authorSnapshot = AuthorSnapshotMocker.create()
    const bookSnapshotA = BookSnapshotMocker.create({ authorId: authorSnapshot.id })
    const bookSnapshotB = BookSnapshotMocker.create({ authorId: authorSnapshot.id })

    await authorRepository.create(authorSnapshot)
    await bookRepository.create(bookSnapshotA)
    await bookRepository.create(bookSnapshotB)

    const body = UpdateAuthorBodyDtoMocker.create()

    // act
    const res = await request(fastifyServer.server)
      [method](route(authorSnapshot.id))
      .send(body)
      .set('Authorization', 'token')

    // assert
    expect(res.status).toEqual(200)
    expect(res.body.data).toEqual<AuthorDto>({
      id: expect.any(String),
      firstName: body.firstName,
      lastName: body.lastName,
      createdAt: expect.any(String),
    })
  })
})
