/*
  Warnings:

  - You are about to drop the column `shift` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Attendance" DROP COLUMN "shift";

-- CreateTable
CREATE TABLE "public"."Shift" (
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "shiftType" "public"."DailyWorkType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("userId","date")
);

-- AddForeignKey
ALTER TABLE "public"."Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
