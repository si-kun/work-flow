"use server";

import { ApiResponse } from "@/types/api/api";
import { MonthlyStatistics } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";
import { timeToMinutes } from "@/utils/timeUtils";
import { Attendance } from "@prisma/client";

interface GetMonthlyAttendanceProps {
  userId: string;
  year: number;
  month: number;
}

export interface MonthlyAttendanceData {
    attendances: Attendance[];
    statistics: MonthlyStatistics;
  }

export const getMonthlyAttendance = async ({
  userId,
  year,
  month,
}: GetMonthlyAttendanceProps): Promise<ApiResponse<MonthlyAttendanceData>> => {

  // console.log("========================================");
  // console.log("🔧 getMonthlyAttendance SERVER ACTION");
  // console.log("📅 Received year:", year);
  // console.log("📅 Received month:", month);
  // console.log("👤 userId:", userId);
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // 集計
    const satistics = attendances.reduce<MonthlyStatistics>(
      (acc, attendance) => {
        // 有給休暇日数
        if (attendance.workType === "paid") {
          acc.paidLeaveDays += 1;
        }

        // 有給申請中
        if (attendance.workType === "paid_pending") {
          acc.acquiredPaidLeaveDays += 1;
        }

        // 欠勤日数
        if (attendance.workType === "absenteeism") {
          acc.absentDays += 1;
        }

        // 日勤の計算
        if (attendance.workType === "day_working" && attendance.workStart && attendance.workEnd) {
          const endTime = timeToMinutes(attendance.workEnd);
          const startTime = timeToMinutes(attendance.workStart);

          let workMinutes = endTime - startTime;

          // 休憩時間を引く
          if(attendance.restStart && attendance.restEnd) {
            const restEndTime = timeToMinutes(attendance.restEnd);
            const restStartTime = timeToMinutes(attendance.restStart);
            workMinutes -= restEndTime - restStartTime;
          }

          acc.workingMinutes += workMinutes;
        }

        // 夜勤時間の計算
        if (attendance.workType === "night_working" && attendance.workStart && attendance.workEnd) {
            const endTime = timeToMinutes(attendance.workEnd) + 24 * 60;
            const startTime = timeToMinutes(attendance.workStart);

            let nightMinutes = endTime - startTime;

                      // 休憩時間を引く
          if(attendance.restStart && attendance.restEnd) {
            const restEndTime = timeToMinutes(attendance.restEnd);
            const restStartTime = timeToMinutes(attendance.restStart);
            nightMinutes -= restEndTime - restStartTime;
          }

            acc.nightShiftMinutes += nightMinutes;

        }

        // 残業時間の計算
        acc.overtimeMinutes += attendance.overtimeMinutes || 0;

        return acc;
      },
      {
        paidLeaveDays: 0,
        acquiredPaidLeaveDays: 0,
        workingMinutes: 0,
        nightShiftMinutes: 0,
        overtimeMinutes: 0,
        absentDays: 0,
      }
    );

    return {
      success: true,
      message: "月間出勤情報の取得に成功しました。",
      data: {
        attendances,
        statistics: satistics,
      },
    };
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    return {
      success: false,
      message: "月間出勤情報の取得に失敗しました。",
      data: {
        attendances: [],
        statistics: {
          paidLeaveDays: 0,
          acquiredPaidLeaveDays: 0,
          workingMinutes: 0,
          nightShiftMinutes: 0,
          overtimeMinutes: 0,
          absentDays: 0,
        },
      },
    };
  }
};
