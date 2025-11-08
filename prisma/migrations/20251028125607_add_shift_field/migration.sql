-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "shift" "public"."DailyWorkType",
ALTER COLUMN "workType" DROP NOT NULL;
