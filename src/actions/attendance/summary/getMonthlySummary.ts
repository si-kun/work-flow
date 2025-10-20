"use server";

import { MonthlySummaryData } from "@/constants/attendance";
import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { timeToMinutes } from "@/utils/timeUtils";

export const getMonthlySummary = async (
  year: number,
  month: number
): Promise<ApiResponse<MonthlySummaryData[]>> => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const users = await prisma.user.findMany();

    if(users.length === 0) {
        return {
            success: true,
            message: "ユーザーが存在しません",
            data: [],
        }
    }

    // 全ユーザーの月次集計を取得
    const summaryData = await Promise.all(
      users.map(async (user) => {
        const attendances = await prisma.attendance.findMany({
          where: {
            userId: user.id,
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        // 総労働時間を計算
        const totalWorkHours = attendances.reduce((sum, att) => {
          if (att.workStart && att.workEnd) {
            const startMinutes = timeToMinutes(att.workStart);
            const endMinutes = timeToMinutes(att.workEnd);

            let workMinutes = endMinutes - startMinutes;

            if (workMinutes < 0) {
              workMinutes += 24 * 60;
            }

            // 休憩時間を引く
            if (att.restStart && att.restEnd) {
              const restMinutes =
                timeToMinutes(att.restEnd) - timeToMinutes(att.restStart);
              workMinutes -= restMinutes;
            }

            return sum + workMinutes;
          }
          return sum;
        }, 0);

        // 夜勤時間の計算
        const nightWorkHours = attendances.reduce((sum, att) => {
          if (
            att.workType === "night_working" &&
            att.workStart &&
            att.workEnd
          ) {
            const startMinutes = timeToMinutes(att.workStart);
            const endMinutes = timeToMinutes(att.workEnd);
            let workMinutes = endMinutes - startMinutes;

            if (workMinutes < 0) {
              workMinutes += 24 * 60;
            }

            // 休憩時間を引く
            if(att.restStart && att.restEnd) {
                const restMinutes =
                    timeToMinutes(att.restEnd) - timeToMinutes(att.restStart);
                workMinutes -= restMinutes;
            }

            return sum + workMinutes;
          }
          return sum;
        }, 0);

        // 有給取得日数
        const paidLeaveUsed = attendances.filter(
          (att) => att.workType === "paid"
        ).length;

        // 欠勤日数
        const absentDays = attendances.filter(
          (att) => att.workType === "absenteeism"
        ).length;

        return {
          userId: user.id,
          name: user.name,
          department: user.department,
          position: user.position,
          totalWorkHours: totalWorkHours,
          nightWorkHours: nightWorkHours,
          overtimeHours: attendances.reduce(
            (sum, att) => sum + (att.overtimeMinutes || 0),
            0
          ),
          paidLeaveUsed,
          paidLeaveRemaining: user.paidLeaveTotal - user.paidLeaveUsed,
          absentDays,
        };
      })
    );
    return {
      success: true,
      message: "月次集計の取得に成功しました",
      data: summaryData,
    };
  } catch (error) {
    console.error("月次集計の取得に失敗しました:", error);
    return {
      success: false,
      message: "月次集計の取得に失敗しました",
      data: [],
    };
  }
};
