/*
  Warnings:

  - Added the required column `userUsername` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "userUsername" VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
