/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - The required column `user_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Subject" (
    "subject_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subject_id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
