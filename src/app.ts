import { Container, interfaces } from 'inversify'

import { AuthorRepository } from './author/application/interfaces/author-repository.interface'
import { CreateAuthorUseCase } from './author/application/use-cases/create-author/create-author.usecase'
import { DeleteAuthorUseCase } from './author/application/use-cases/delete-author/delete-author.usecase'
import { FindAuthorUseCase } from './author/application/use-cases/find-author/find-author.usecase'
import { UpdateAuthorUseCase } from './author/application/use-cases/update-author/update-author.usecase'
import { AuthorMongoRepository } from './author/infra/repositories/mongo/author/author.mongo-repository'
import { AuthorDomainErrorMapper } from './author/infra/rest/author-domain-error.mapper'
import { CreateAuthorController } from './author/infra/rest/fastify/controllers/create-author/create-author.controller'
import { DeleteAuthorController } from './author/infra/rest/fastify/controllers/delete-author/delete-author.controller'
import { FindAuthorController } from './author/infra/rest/fastify/controllers/find-author/find-author.controller'
import { UpdateAuthorController } from './author/infra/rest/fastify/controllers/update-author/update-author.controller'
import { BookRepository } from './book/application/interfaces/book-repository.interface'
import { CreateBookUseCase } from './book/application/use-cases/create-book/create-book.usecase'
import { BookMongoRepository } from './book/infra/repositories/mongo/book/book.mongo-repository'
import { BookDomainErrorMapper } from './book/infra/rest/book-domain-error.mapper'
import { CreateBookController } from './book/infra/rest/fastify/controllers/create-book/create-book.controller'
import { EntityValidator } from './common/application/interfaces/entity-validator.interface'
import { TYPES } from './common/infra/ioc/types'
import { EnvDatabaseConfig } from './common/infra/repositories/env-database.config'
import { DatabaseConfig } from './common/infra/repositories/interfaces/database-config.interface'
import { DatabaseConnector } from './common/infra/repositories/interfaces/database-connector.interface'
import { MongoConnector } from './common/infra/repositories/mongo.connector'
import { EnvServerConfig } from './common/infra/rest/env-server.config'
import { FastifyServer } from './common/infra/rest/fastify/fastify-server'
import { ServerConfig } from './common/infra/rest/server-config.interface'
import { ClassValidatorEntityValidator } from './common/infra/services/class-validator-author-entity.validator'

export class App {
  private container!: Container

  private constructor() {}

  private createContainer() {
    const container = new Container()

    // Services
    container
      .bind<EntityValidator<unknown>>(TYPES.EntityValidator)
      .to(ClassValidatorEntityValidator)
      .inSingletonScope()

    // Database
    container
      .bind<DatabaseConfig>(TYPES.DatabaseConfig)
      .to(EnvDatabaseConfig)
      .inSingletonScope()
    container
      .bind<DatabaseConnector>(TYPES.DatabaseConnector)
      .to(MongoConnector)
      .inSingletonScope()

    // Author
    container
      .bind<AuthorRepository>(TYPES.AuthorRepository)
      .to(AuthorMongoRepository)
      .inSingletonScope()

    container
      .bind<AuthorDomainErrorMapper>(TYPES.AuthorDomainErrorMapper)
      .to(AuthorDomainErrorMapper)
      .inSingletonScope()

    container
      .bind<CreateAuthorUseCase>(TYPES.CreateAuthorUseCase)
      .to(CreateAuthorUseCase)
      .inSingletonScope()
    container
      .bind<CreateAuthorController>(TYPES.CreateAuthorController)
      .to(CreateAuthorController)
      .inSingletonScope()

    container
      .bind<FindAuthorUseCase>(TYPES.FindAuthorUseCase)
      .to(FindAuthorUseCase)
      .inSingletonScope()
    container
      .bind<FindAuthorController>(TYPES.FindAuthorController)
      .to(FindAuthorController)
      .inSingletonScope()

    container
      .bind<UpdateAuthorUseCase>(TYPES.UpdateAuthorUseCase)
      .to(UpdateAuthorUseCase)
      .inSingletonScope()
    container
      .bind<UpdateAuthorController>(TYPES.UpdateAuthorController)
      .to(UpdateAuthorController)
      .inSingletonScope()

    container
      .bind<DeleteAuthorUseCase>(TYPES.DeleteAuthorUseCase)
      .to(DeleteAuthorUseCase)
      .inSingletonScope()
    container
      .bind<DeleteAuthorController>(TYPES.DeleteAuthorController)
      .to(DeleteAuthorController)
      .inSingletonScope()

    // Book
    container
      .bind<BookRepository>(TYPES.BookRepository)
      .to(BookMongoRepository)
      .inSingletonScope()

    container
      .bind<BookDomainErrorMapper>(TYPES.BookDomainErrorMapper)
      .to(BookDomainErrorMapper)
      .inSingletonScope()

    container
      .bind<CreateBookUseCase>(TYPES.CreateBookUseCase)
      .to(CreateBookUseCase)
      .inSingletonScope()
    container
      .bind<CreateBookController>(TYPES.CreateBookController)
      .to(CreateBookController)
      .inSingletonScope()

    // Server
    container
      .bind<ServerConfig>(TYPES.ServerConfig)
      .to(EnvServerConfig)
      .inSingletonScope()
    container
      .bind<FastifyServer>(TYPES.FastifyServer)
      .to(FastifyServer)
      .inSingletonScope()

    this.container = container
  }

  private async startServer() {
    const serverConfig = this.container.get<ServerConfig>(TYPES.ServerConfig)

    const createAuthorController = this.container.get<CreateAuthorController>(
      TYPES.CreateAuthorController,
    )
    const findAuthorController = this.container.get<FindAuthorController>(
      TYPES.FindAuthorController,
    )
    const updateAuthorController = this.container.get<UpdateAuthorController>(
      TYPES.UpdateAuthorController,
    )
    const deleteAuthorController = this.container.get<DeleteAuthorController>(
      TYPES.DeleteAuthorController,
    )

    const createBookController = this.container.get<CreateBookController>(
      TYPES.CreateBookController,
    )

    const fastifyServer = this.container.get<FastifyServer>(TYPES.FastifyServer)

    fastifyServer.addRoute(createAuthorController.route)
    fastifyServer.addRoute(findAuthorController.route)
    fastifyServer.addRoute(updateAuthorController.route)
    fastifyServer.addRoute(deleteAuthorController.route)

    fastifyServer.addRoute(createBookController.route)

    await fastifyServer.listen(serverConfig.getPort())

    if (process.env['NODE_ENV'] !== 'test') {
      console.info(`The app has is listening on port ${serverConfig.getPort()}`)
    }
  }

  private async startDatabase() {
    const dbConnection = this.container.get<DatabaseConnector>(
      TYPES.DatabaseConnector,
    )
    await dbConnection.connect()
  }

  async clearDatabase() {
    const dbConnector = this.container.get<DatabaseConnector>(
      TYPES.DatabaseConnector,
    )
    await dbConnector.clearDatabase()
  }

  get<T>(token: interfaces.ServiceIdentifier<T>) {
    return this.container.get<T>(token)
  }

  async destroy() {
    const server = this.container.get<FastifyServer>(TYPES.FastifyServer)
    await server.stop()

    const database = this.container.get<DatabaseConnector>(
      TYPES.DatabaseConnector,
    )
    await database.disconnect()
  }

  static async create(): Promise<App> {
    const app = new App()

    app.createContainer()

    await app.startServer()
    await app.startDatabase()

    return app
  }

  /** Could define particular settings for testing. */
  static async createTestApp(): Promise<App> {
    return App.create()
  }
}
