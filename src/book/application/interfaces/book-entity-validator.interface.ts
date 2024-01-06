import { EntityValidator } from '../../../common/application/interfaces/entity-validator.interface'
import { BookEntity } from '../../domain/entities/book.entity'

export interface BookEntityValidator extends EntityValidator<BookEntity> {}
