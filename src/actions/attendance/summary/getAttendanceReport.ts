"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Attendance } from "@prisma/client";

export const getAttendanceReport = async (
  userId: string,
  start: Date,
  end: Date
): Promise<ApiResponse<Attendance[]>> => {
  try {

    const now = new Date();
    const year = now.getFullYear();

    const response = await prisma.attendance.findMany({
      where: {
        userId: userId,
        date: {
          gte: start ?? new Date(year, 0, 1),
          lte: end ?? new Date(year, 11, 31),
        },
      },
        orderBy: {
            date: "asc",
        },
    });

    return {
      success: true,
      message: "出勤報告を取得しました",
      data: response,
    };
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    return {
      success: false,
      message: "出勤報告の取得中にエラーが発生しました",
      data: [],
    };
  }
};
