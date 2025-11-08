"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Attendance } from "@prisma/client";



export const getTodayAllAttendance = async (
  targetDate: Date): Promise<ApiResponse<Attendance[]>> => {
  try {
    // 今日の0時(日本時間)
    const startOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      0,
      0,
      0,
      0
    );

    // 明日の0時(日本時間)
    const endOfDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate() + 1,
      0,
      0,
      0,
      0
    );
    const result = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    console.log("取得した全勤怠情報", result);
    console.log("取得件数", result.length);

    return {
      success: true,
      message: "今日の全勤怠情報を取得しました",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "今日の全勤怠情報の取得に失敗しました",
      data: [],
    };
  }
};
