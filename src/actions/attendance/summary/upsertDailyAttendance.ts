"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData } from "@/types/attendance";
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
        workType: data.workType,
        workStart: data.workStart,
        workStartType: data.workStartType,
        workEnd: data.workEnd,
        workEndType: data.workEndType,
        restStart: data.restStart,
        restEnd: data.restEnd,
        overtimeMinutes: data.overtimeMinutes,
      },
      create: {
        userId: userId,
        date: new Date(),
        workType: data.workType,
        workStart: data.workStart,
        workStartType: data.workStartType,
        workEnd: data.workEnd,
        workEndType: data.workEndType,
        restStart: data.restStart,
        restEnd: data.restEnd,
        overtimeMinutes: data.overtimeMinutes,
      },
    });

    return {
      success: true,
      message: "Daily attendance updated successfully.",
      data: null,
    };
  } catch (error) {
    console.log(error, "upsertDailyAttendance error");
    return {
      success: false,
      message: "Error updating daily attendance.",
      data: null,
    };
  }
};
