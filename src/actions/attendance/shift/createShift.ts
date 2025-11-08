"use server";

import { ShiftType } from "@/constants/calendarColor";
import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";

interface ShiftData {
  shiftType: ShiftType;
  dates: string[];
}

interface CreateShiftInput {
  userIds: string[];
  shifts: ShiftData[];
  year: number;
  month: number;
}

export const createShift = async ({
  userIds,
  shifts,
  year,
  month,
}: CreateShiftInput): Promise<ApiResponse<null>> => {
  try {

    await prisma.$transaction(async (tx) => {

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      // 各ユーザーに対して
      for (const userId of userIds) {
        // 作成前に既存シフトを削除する
        await tx.shift.deleteMany({
          where: {
            userId,
            date: {
              gte: startDate,
              lt: endDate,
            }
          }
        })
        // 各シフトデータに対して
        for (const shift of shifts) {
          // 各日付に対して
          for (const date of shift.dates) {



            // シフトを作成
            await tx.shift.create({
              data: {
                userId,
                date: new Date(date),
                shiftType: shift.shiftType,
              }
            })
          }
        }
      }
    });

    return {
      success: true,
      message: "シフトを作成しました。",
      data: null,
    };
  } catch (error) {
    console.error(error);

    // 外部キー制約エラー
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2003") {
        return {
          success: false,
          message: "存在しないユーザーが含まれています。",
          data: null,
        };
      }
    }

    return {
      success: false,
      message: "シフトの作成に失敗しました。",
      data: null,
    };
  }
};
