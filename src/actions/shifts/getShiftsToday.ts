"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Shift } from "@prisma/client";


export const getShiftsToday = async(date: Date):Promise<ApiResponse<Shift[]>> => {
    try {

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const response = await prisma.shift.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                }
            }
        })

        return {
            success: true,
            message: "シフトの取得に成功しました。",
            data: response,
        }
    } catch(error) {
        console.error("シフトの取得中にエラーが発生しました:", error);
        return {
          success: false,
          message: "シフトの取得に失敗しました。",
          data: [],
        };
    }
}