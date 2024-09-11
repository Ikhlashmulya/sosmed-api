import { config } from "dotenv";

export class Config {
  static {
    config();
  }

  static get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error("environment variable must be exist");
    }
    return value;
  }
}
