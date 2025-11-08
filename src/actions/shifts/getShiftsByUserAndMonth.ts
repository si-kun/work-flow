"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Shift } from "@prisma/client";

interface GetShiftsByUserAndMonth {
  userId: string;
  year: number;
  month: number;
}

export const getShiftsByUserAndMonth = async ({
  userId,
  year,
  month,
}: GetShiftsByUserAndMonth): Promise<ApiResponse<Shift[]>> => {
  try {
    // 取得する月の初月と末日を計算
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // シフトを取得
    const shifts = await prisma.shift.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      });

    return {
      success: true,
      message: "シフトの取得に成功しました。",
      data: shifts,
    };
  } catch (error) {
    console.error("シフトの取得中にエラーが発生しました:", error);
    return {
      success: false,
      message: "シフトの取得に失敗しました。",
      data: [],
    };
  }
};
