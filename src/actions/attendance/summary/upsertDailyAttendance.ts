"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData, DailyWorkType } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";

export const upsertDailyAttendance = async (
  userId: string,
  data: DailyAttendanceData
): Promise<ApiResponse<DailyAttendanceData | null>> => {
  try {
    await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: data.date,
        },
      },
      update: {
        workType: data.workType as DailyWorkType,
        workStart: data.workStart || null,
        workStartType: data.workStartType || null,
        workEnd: data.workEnd || null,
        workEndType: data.workEndType || null,
        restStart: data.restStart || null,
        restEnd: data.restEnd || null,
        overtimeMinutes: data.overtimeMinutes,
      },
      create: {
        userId: userId,
        date: data.date,
        workType: data.workType as DailyWorkType,
        workStart: data.workStart || null,
        workStartType: data.workStartType || null,
        workEnd: data.workEnd || null,
        workEndType: data.workEndType || null,
        restStart: data.restStart || null,
        restEnd: data.restEnd || null,
        overtimeMinutes: data.overtimeMinutes,
      },
    });

    return {
      success: true,
      message: "Daily attendance updated successfully.",
      data: null,
    };
  } catch (error) {
    console.error(error, "upsertDailyAttendance error");
    return {
      success: false,
      message: "Error updating daily attendance.",
      data: null,
    };
  }
};
