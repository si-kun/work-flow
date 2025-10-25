"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData, DailyWorkType } from "@/types/attendance";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";
import { prisma } from "@/utils/prisma/prisma";

export const ClockIn = async (
  userId: string,
  workType: DailyWorkType
): Promise<ApiResponse<DailyAttendanceData | null>> => {
  try {
    // 日付けを取得
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // 既に打刻済みか確認
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    // 打刻済みの場合はエラーを投げる
    if (existing && existing.workStart) {
      return {
        success: false,
        message: "既に打刻済みです",
        data: null,
      };
    }

    const { workStartType } = calcWorkAndOvertime(workType, {
      date: today,
      workType,
      workStart: currentTime,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    });

    // 打刻データを作成
    const result = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        workType,
        workStart: currentTime,
        workStartType,
        workEnd: null,
        restStart: null,
        restEnd: null,
        overtimeMinutes: 0,
      },
    });

    return {
      success: true,
      message: "打刻が完了しました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "打刻に失敗しました",
      data: null,
    };
  }
};
