import crypto from "crypto";
import { inject, injectable } from "inversify";

import { UseCase } from "../../../../common/application/types/use-case";
import {
  ResultFailure,
  ResultSuccess,
} from "../../../../common/domain/results/result";
import { TYPES } from "../../../../common/infra/ioc/types";
import { AuthorEntity } from "../../../domain/entities/author.entity";
import { AuthorValidationError } from "../../../domain/errors/author-validation.error";
import { AuthorSnapshot } from "../../../domain/types/author.types";
import { AuthorEntityValidator } from "../../interfaces/author-entity-validator.interface";
import { AuthorRepository } from "../../interfaces/author-repository.interface";
import { CreateAuthorCommand } from "./create-author.command";

@injectable()
export class CreateAuthorUseCase
  implements UseCase<AuthorSnapshot, AuthorValidationError>
{
  constructor(
    @inject(TYPES.AuthorRepository) private authorRepository: AuthorRepository,
    @inject(TYPES.EntityValidator)
    private authorEntityValidator: AuthorEntityValidator
  ) {}

  async execute(command: CreateAuthorCommand) {
    const currentDate = new Date();

    const authorEntity = AuthorEntity.create({
      id: crypto.randomUUID(),
      firstName: command.firstName,
      lastName: command.lastName,
      birthDate: command.birthDate,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    const validationErrors = this.authorEntityValidator.validate(authorEntity);

    if (validationErrors) {
      return new ResultFailure(new AuthorValidationError(validationErrors));
    }

    await this.authorRepository.create(authorEntity.getSnapshot());

    return new ResultSuccess(authorEntity.getSnapshot());
  }
}
