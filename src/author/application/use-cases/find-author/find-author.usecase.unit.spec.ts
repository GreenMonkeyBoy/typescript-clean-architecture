import { faker } from "@faker-js/faker";

import { AuthorEntityMocker } from "../../../domain/entities/author.entity.mocker";
import { AuthorRepositoryMocker } from "../../interfaces/author-repository-interface.mocker";
import { AuthorRepository } from "../../interfaces/author-repository.interface";
import { FindAuthorUseCase } from "./find-author.usecase";

describe("UNIT::FindAuthorUseCase", () => {
  let authorRepository: AuthorRepository;
  let findAuthorUseCase: FindAuthorUseCase;

  const findAuthorUseCaseMocker = (data?: {
    authorRepository?: AuthorRepository;
  }): FindAuthorUseCase => {
    authorRepository =
      data?.authorRepository || AuthorRepositoryMocker.create();
    return new FindAuthorUseCase(authorRepository);
  };

  beforeEach(() => {
    findAuthorUseCase = findAuthorUseCaseMocker();
  });

  it(`should find the author in repository`, async () => {
    // arrange
    const id = faker.string.uuid();

    const findById = jest.spyOn(authorRepository, "findById");

    // act
    await findAuthorUseCase.execute(id);

    // assert
    expect(findById).toHaveBeenCalledTimes(1);
    expect(findById.mock.calls[0][0]).toEqual(id);
  });

  it(`when the author is not in repository, should return a failure result`, async () => {
    // arrange
    const id = faker.string.uuid();

    jest.spyOn(authorRepository, "findById").mockResolvedValueOnce(null);

    // act
    const res = await findAuthorUseCase.execute(id);

    // assert
    expect(res.isFailure()).toEqual(true);
  });

  it(`should return a success result`, async () => {
    // arrange
    const authorEntity = AuthorEntityMocker.create();

    jest
      .spyOn(authorRepository, "findById")
      .mockResolvedValueOnce(authorEntity);

    // act
    const res = await findAuthorUseCase.execute(authorEntity.getSnapshot().id);

    // assert
    expect(res.isSuccess()).toEqual(true);
  });
});
