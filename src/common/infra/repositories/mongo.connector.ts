import { inject, injectable } from "inversify";
import mongoose from "mongoose";

import { DatabaseConfig } from "./interfaces/database-config.interface";
import { DatabaseConnector } from "./interfaces/database-connector.interface";
import { TYPES } from "../ioc/types";

@injectable()
export class MongoConnector implements DatabaseConnector {
  #connection: mongoose.Mongoose | undefined;

  constructor(@inject(TYPES.DatabaseConfig) private dbConfig: DatabaseConfig) {}

  async connect() {
    this.#connection = await mongoose.connect(this.dbConfig.getDbUri(), {
      dbName: this.dbConfig.getDbName(),
    });
  }

  async disconnect() {
    await this.#connection?.disconnect();
  }

  async clearDatabase() {
    await this.#connection?.connection.dropDatabase();
  }
}
