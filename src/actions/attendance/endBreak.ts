"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";

export const EndBreak = async(userId: string):Promise<ApiResponse<DailyAttendanceData | null>> => {
    try {

        // 日付取得
        const now = new Date();
        const today = new Date(now.getFullYear(),now.getMonth(),now.getDate())
        const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`

        // 今日の勤怠を取得
        const existing = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                }
            }
        })

        // 出勤打刻がされていない場合
        if(!existing || !existing.workStart) {
            return {
                success: false,
                message: "出勤打刻がされていません",
                data: null,
            }
        }

        // 休憩開始がされていない場合
        if(!existing.restStart) {
            return {
                success: false,
                message: "休憩開始打刻がされていません",
                data: null,
            }
        }

        // 既に休憩済みの場合
        if(existing.restEnd) {
            return {
                success: false,
                message: "既に休憩終了打刻済みです",
                data: null,
            }
        }

        // 休憩終了打刻
        const result = await prisma.attendance.update({
            where: {
                userId_date: {
                    userId,
                    date: today,
                }
            },
            data: {
                restEnd: currentTime,
            }
        })

        return {
            success: true,
            message: "休憩終了打刻に成功しました",
            data: result,
        }

    } catch(error) {
        console.error("EndBreak error:", error);
        return {
            success: false,
            message: "休憩終了打刻に失敗しました",
            data: null,
        }
    }
}