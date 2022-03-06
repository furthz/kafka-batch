import * as logger from "pino";

const { networkInterfaces } = require("os");

export enum Level {
  emerg = "EMERG",
  alert = "ALERT",
  crit = "CRIT",
  error = "ERROR",
  warn = "WARM",
  notice = "NOTICE",
  info = "INFO",
  debug = "DEBUG",
}

const getIP = (): string => {
  const nets = networkInterfaces();
  const results = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results["eth0"][0];
};

export class Logger {
  protected static levels = {
    emerg: 80,
    alert: 70,
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
  };
  protected static log = logger.pino({
    base: {
      logger: process.env.SERVICE_NAME,
      ip: getIP(),
    },
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    customLevels: Logger.levels,
    useOnlyCustomLevels: true,
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    messageKey: "message",
  });

  static message(
    level: Level,
    metadata: object,
    transaction_id: string,
    msg: string
  ): void {
    switch (level) {
      case Level.debug:
        Logger.log.debug(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.info:
        Logger.log.info(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.notice:
        Logger.log.notice(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.warn:
        Logger.log.warn(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.error:
        Logger.log.error(new Error(msg));
        break;
      case Level.crit:
        Logger.log.crit(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.alert:
        Logger.log.alert(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
      case Level.emerg:
        Logger.log.emerg(
          { metadata: metadata, transaction_id: transaction_id },
          msg
        );
        break;
    }
  }
}
