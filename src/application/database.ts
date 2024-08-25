import { PrismaClient } from "@prisma/client";

export class Database {
  static prisma: PrismaClient;

  static getInstance(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
      return this.prisma;
    }

    return this.prisma;
  }
}
