import { faker } from "@faker-js/faker";
import request from "supertest";

import { App } from "../../../../../../app";
import { TYPES } from "../../../../../../common/infra/ioc/types";
import { FastifyServer } from "../../../../../../common/infra/rest/fastify/fastify-server";
import { AuthorRepository } from "../../../../../application/interfaces/author-repository.interface";
import { AuthorSnapshotMocker } from "../../../../../domain/types/author-snapshot.mocker";

describe("E2E::DeleteAuthorController", () => {
  let app: App;
  let authorRepository: AuthorRepository;
  let fastifyServer: FastifyServer;

  const method = "delete";
  const route = (id?: string) => `/authors/${id || faker.string.uuid()}`;

  beforeAll(async () => {
    app = await App.createTestApp();

    fastifyServer = app.get<FastifyServer>(TYPES.FastifyServer);
    authorRepository = app.get<AuthorRepository>(TYPES.AuthorRepository);
  });

  afterEach(async () => {
    await app.clearDatabase();
  });

  afterAll(async () => {
    await app.destroy();
  });

  it(`when the 'Authorization' header is not defined, should return a 401`, async () => {
    // arrange
    // act
    const res = await request(fastifyServer.server)[method](route());

    // assert
    expect(res.status).toEqual(401);
    expect(res.body.error).toBeDefined();
  });

  it(`when the repository throws an unexpected error, should return a 500 response`, async () => {
    // arrange
    jest.spyOn(authorRepository, "delete").mockImplementationOnce(() => {
      throw new Error(faker.lorem.words());
    });

    // act
    const res = await request(fastifyServer.server)
      [method](route())
      .set("Authorization", "token");

    // assert
    expect(res.status).toEqual(500);
    expect(res.body.error.message).toEqual(`Internal Server Error`);
  });

  it(`should return a 204`, async () => {
    // arrange
    const authorSnapshot = AuthorSnapshotMocker.create();

    authorRepository.create(authorSnapshot);

    // act
    const res = await request(fastifyServer.server)
      [method](route(authorSnapshot.id))
      .set("Authorization", "token");

    // assert
    expect(res.status).toEqual(204);
  });
});
