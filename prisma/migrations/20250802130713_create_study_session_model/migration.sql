-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "studyTime" INTEGER;

-- CreateTable
CREATE TABLE "StudySession" (
    "session_id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("session_id")
);

-- AddForeignKey
ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;
