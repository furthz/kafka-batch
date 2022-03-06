import { Connection, createConnection, SimpleConsoleLogger } from "typeorm";

export class Database {
  public connection: Connection;

  constructor() {
      this.connectToDB();
  }

  private connectToDB(): void {
    createConnection({
      type: "postgres",
      host: process.env.HOST_DB,
      port: 5432,
      username: "root",
      password: "root",
      database: "kafka",
      entities: ["dist/entity/**/*.js"],
      synchronize: true,
    })
      .then((_con) => {
        this.connection = _con;
        console.debug(`Connectado a la DB: ${_con.isConnected}`);
      })
      .catch(console.error);
  }
}

export const db = new Database();
