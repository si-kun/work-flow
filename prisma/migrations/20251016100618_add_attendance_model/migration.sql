-- CreateEnum
CREATE TYPE "public"."DailyWorkType" AS ENUM ('day_working', 'night_working', 'paid', 'paid_pending', 'absenteeism', 'day_off');

-- CreateEnum
CREATE TYPE "public"."ClockInType" AS ENUM ('early_arrival', 'on_time', 'late');

-- CreateEnum
CREATE TYPE "public"."ClockOutType" AS ENUM ('early_leave', 'on_time', 'over_time');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "paidLeaveTotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paidLeaveUsed" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workType" "public"."DailyWorkType" NOT NULL,
    "workStart" TEXT,
    "workStartType" "public"."ClockInType",
    "workEnd" TEXT,
    "workEndType" "public"."ClockOutType",
    "restStart" TEXT,
    "restEnd" TEXT,
    "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("userId","date")
);

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
