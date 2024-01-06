import { faker } from "@faker-js/faker";
import crypto from "crypto";

import { EntityValidatorMocker } from "../../../../common/application/interfaces/entity-validator.interface.mocker";
import { AuthorErrors } from "../../../domain/errors/author.errors";
import { AuthorEntityValidator } from "../../interfaces/author-entity-validator.interface";
import { AuthorRepositoryMocker } from "../../interfaces/author-repository-interface.mocker";
import { AuthorRepository } from "../../interfaces/author-repository.interface";
import { CreateAuthorCommand } from "./create-author.command";
import { CreateAuthorUseCase } from "./create-author.usecase";

class CreateAuthorCommandMocker {
  static create(data?: Partial<CreateAuthorCommand>): CreateAuthorCommand {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      birthDate: faker.date.past(),
      ...data,
    };
  }
}

describe("UNIT::CreateAuthorUseCase", () => {
  let authorRepository: AuthorRepository;
  let createAuthorUseCase: CreateAuthorUseCase;
  let authorEntityValidator: AuthorEntityValidator;

  const createAuthorUseCaseMocker = (data?: {
    authorRepository?: AuthorRepository;
    authorEntityValidator?: AuthorEntityValidator;
  }): CreateAuthorUseCase => {
    authorRepository =
      data?.authorRepository || AuthorRepositoryMocker.create();
    authorEntityValidator =
      data?.authorEntityValidator || EntityValidatorMocker.create();

    return new CreateAuthorUseCase(authorRepository, authorEntityValidator);
  };

  beforeEach(() => {
    createAuthorUseCase = createAuthorUseCaseMocker();
  });

  it(`when then entity validator returns an error, should return a failure result`, async () => {
    // assert
    jest.spyOn(authorEntityValidator, "validate").mockReturnValueOnce([]);

    // act
    const res = await createAuthorUseCase.execute({
      firstName: "adfsd",
      lastName: faker.person.lastName(),
    });

    // assert
    expect(res.isFailure()).toEqual(true);
    expect(res.error?.code).toEqual(AuthorErrors.VALIDATION_ERROR);
  });

  it(`should create the author in repository`, async () => {
    // arrange
    const id = faker.string.uuid();
    const createAuthorCommand = CreateAuthorCommandMocker.create();

    jest.spyOn(crypto, "randomUUID").mockReturnValueOnce(id as any);

    const create = jest.spyOn(authorRepository, "create");

    // act
    await createAuthorUseCase.execute(createAuthorCommand);

    // assert
    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0][0].id).toEqual(id);
    expect(create.mock.calls[0][0].firstName).toEqual(
      createAuthorCommand.firstName
    );
    expect(create.mock.calls[0][0].lastName).toEqual(
      createAuthorCommand.lastName
    );
    expect(create.mock.calls[0][0].birthDate).toEqual(
      createAuthorCommand.birthDate
    );
    expect(create.mock.calls[0][0].createdAt.getTime()).toBeCloseTo(
      new Date().getTime(),
      -3
    );
    expect(create.mock.calls[0][0].updatedAt.getTime()).toBeCloseTo(
      new Date().getTime(),
      -3
    );
  });

  it(`should return a success result`, async () => {
    // arrange
    const createAuthorCommand = CreateAuthorCommandMocker.create();
    const uuid = faker.string.uuid();

    jest.spyOn(crypto, "randomUUID").mockReturnValueOnce(uuid as any);

    // act
    const res = await createAuthorUseCase.execute(createAuthorCommand);

    // assert
    expect(res.isSuccess()).toEqual(true);
  });
});
