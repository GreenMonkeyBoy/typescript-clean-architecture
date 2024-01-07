export const TYPES = {
  // Services
  EntityValidator: Symbol.for('EntityValidator'),

  // Repositories
  DatabaseConfig: Symbol.for('DatabaseConfig'),
  DatabaseConnector: Symbol.for('DatabaseConnector'),

  // Server
  ServerConfig: Symbol.for('ServerConfig'),
  FastifyServer: Symbol.for('FastifyServer'),

  // Author
  AuthorRepository: Symbol.for('AuthorRepository'),

  CreateAuthorUseCase: Symbol.for('CreateAuthorUseCase'),
  CreateAuthorController: Symbol.for('CreateAuthorController'),

  FindAuthorUseCase: Symbol.for('FindAuthorUseCase'),
  FindAuthorController: Symbol.for('FindAuthorController'),

  UpdateAuthorUseCase: Symbol.for('UpdateAuthorUseCase'),
  UpdateAuthorController: Symbol.for('UpdateAuthorController'),

  DeleteAuthorUseCase: Symbol.for('DeleteAuthorUseCase'),
  DeleteAuthorController: Symbol.for('DeleteAuthorController'),

  AuthorDomainErrorMapper: Symbol.for('AuthorDomainErrorMapper'),

  // Book
  BookRepository: Symbol.for('BookRepository'),

  CreateBookUseCase: Symbol.for('CreateBookUseCase'),
  CreateBookController: Symbol.for('CreateBookController'),

  BookDomainErrorMapper: Symbol.for('BookDomainErrorMapper'),
}
