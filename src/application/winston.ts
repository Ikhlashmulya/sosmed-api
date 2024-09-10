import { createLogger } from "winston";
import * as winston from "winston";

export const logger = createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
