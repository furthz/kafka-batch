import "reflect-metadata";
import { UserRepository } from "./Repository/UserRepository";
import { Database, db } from "./Database";
import { ConsumerReport } from "./Consumer/Consumer";


const connection: Database = db;
const userRepo = new UserRepository();
var consumidor = new ConsumerReport();

consumidor.run(userRepo);
