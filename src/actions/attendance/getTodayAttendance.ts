"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Attendance } from "@prisma/client";

export const GetTodayAttendance = async(userId: string):Promise<ApiResponse<Attendance | null>> => {
    try {

        // 日付を取得
        const now = new Date();
        const today = new Date(now.getFullYear(),now.getMonth(),now.getDate())

        // 今日の勤怠情報を取得
        const result = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId: userId,
                    date: today,
                }
            }
        })

        if(!result) {
            return {
                success: true,
                message: "今日の勤怠情報は存在しません",
                data: null,
            }
        }

        return {
            success: true,
            message: "今日の勤怠情報を取得しました",
            data: result,
        }

    } catch(error) {
        console.error(error)
        return {
            success: false,
            message: "今日の勤怠情報の取得に失敗しました",
            data: null,
        }
    }
}