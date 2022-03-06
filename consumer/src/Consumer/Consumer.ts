import { Consumer, Kafka } from "kafkajs";
import { User } from "../entity/User";
import { UserRepository } from "../Repository/UserRepository";
import { Logger, Level } from "../Log/Log";

export class ConsumerReport {
  protected kafka: Kafka;
  protected consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: "ConsumerReport",
      brokers: [process.env.BROKER_KAFKA!],
    });

    this.consumer = this.kafka.consumer({
      groupId: "ReportGroup",
      sessionTimeout: 10000,
      rebalanceTimeout: 30000,
      retry: {
        initialRetryTime: 100,
        retries: 10,
        factor: 0.5,
        multiplier: 5,
      },
    });
  }

  async run(repository: UserRepository) {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: process.env.TOPIC!,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachBatchAutoResolve: false,
      //autoCommit: false,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        commitOffsetsIfNecessary,
        uncommittedOffsets,
        isRunning,
        isStale,
      }) => {
        this.consumer.pause([{ topic: process.env.TOPIC! }]);
        Logger.message(Level.debug, {}, "", "==========");
        Logger.message(
          Level.info,
          {},
          "",
          `Procesando mensajes en grupos de: ${batch.messages.length}`
        );

        for (const message of batch.messages) {
          try {
            if (!isRunning() && !isStale()) {
              break; //mensajes que deben descartarse
            }
            //procesar un mensaje
            let messageObj = JSON.parse(message.value!.toString());
            Logger.message(
              Level.debug,
              messageObj,
              messageObj.name,
              "Mensaje procesado del broker"
            );
            //Logger.message(Level.error, {}, "", "test");

            let user: User = new User();
            user.email = messageObj.email;
            user.name = messageObj.name;

            await repository.crearUsuario(user);

            resolveOffset(message.offset);

            await heartbeat();

            const lstUser = await repository.obtenerListaUsuarios();
            Logger.message(
              Level.debug,
              {},
              "",
              `Cantidad de usuarios: ${lstUser.length}`
            );
          } catch (e) {
            if (e instanceof Error) {
              Logger.message(Level.error, {}, "", e.message);
            }
          }
        }
        Logger.message(Level.debug, {}, "", "==========");
        this.consumer.resume([{ topic: process.env.TOPIC! }]);
      },
    });
  }
}
