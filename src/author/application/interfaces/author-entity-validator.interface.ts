import { EntityValidator } from '../../../common/application/interfaces/entity-validator.interface'
import { AuthorEntity } from '../../domain/entities/author.entity'

export interface AuthorEntityValidator extends EntityValidator<AuthorEntity> {}
