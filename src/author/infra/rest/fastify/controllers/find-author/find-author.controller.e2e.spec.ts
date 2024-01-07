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

describe('E2E::FindAuthorController', () => {
  let app: App
  let authorRepository: AuthorRepository
  let bookRepository: BookRepository
  let fastifyServer: FastifyServer

  const method = 'get'
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

  it(`when the author not exists, should return a 404 response`, async () => {
    // act
    const res = await request(fastifyServer.server)[method](route())

    // assert
    expect(res.status).toEqual(404)
  })

  it(`when the repository throws an unexpected error, should return a 500 response`, async () => {
    // arrange
    jest.spyOn(authorRepository, 'findById').mockImplementationOnce(() => {
      throw new Error(faker.lorem.words())
    })

    // act
    const res = await request(fastifyServer.server)[method](route())

    // assert
    expect(res.status).toEqual(500)
    expect(res.body.error.message).toEqual(`Internal Server Error`)
  })

  it(`should return a 200 response containing the author`, async () => {
    // arrange
    const authorSnapshot = AuthorSnapshotMocker.create()
    const bookSnapshotA = BookSnapshotMocker.create({
      authorId: authorSnapshot.id,
    })
    const bookSnapshotB = BookSnapshotMocker.create({
      authorId: authorSnapshot.id,
    })

    await authorRepository.create(authorSnapshot)
    await bookRepository.create(bookSnapshotA)
    await bookRepository.create(bookSnapshotB)

    // act
    const res = await request(fastifyServer.server)[method](
      route(authorSnapshot.id),
    )

    // assert
    expect(res.status).toEqual(200)
    expect(res.body.data).toEqual<AuthorDto>({
      id: authorSnapshot.id,
      firstName: authorSnapshot.firstName,
      lastName: authorSnapshot.lastName,
      createdAt: authorSnapshot.createdAt.toISOString(),
    })
  })
})
