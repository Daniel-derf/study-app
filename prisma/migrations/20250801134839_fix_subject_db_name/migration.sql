/*
  Warnings:

  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_user_id_fkey";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
