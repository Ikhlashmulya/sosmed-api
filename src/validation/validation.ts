import { ZodType } from "zod";

export class Validation {
  validate<T>(schema: ZodType, data: T): T {
    return schema.parse(data);
  }
}
