import { createLogger } from "winston";
import * as winston from "winston";
import { Config } from "./config";

export const logger = createLogger({
  level: Config.get("LOG_LEVEL"),
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
