"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData } from "@/types/attendance";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";
import { prisma } from "@/utils/prisma/prisma";

export const ClockOut = async (userId: string): Promise<ApiResponse<DailyAttendanceData | null>> => {
    try {

        // 日付取得
        const now = new Date();
        const today = new Date(now.getFullYear(),now.getMonth(),now.getDate())
        const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`

        // 既に打刻済みか確認
        const existing = await prisma.attendance.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                }
            }
        })

        // 打刻済みの場合はエラーを投げる
        if(!existing || !existing.workStart) {
            return {
                success: false,
                message: "出勤打刻がされていません",
                data: null,
            }
        }

        // 既に退勤打刻済みの場合
        if(existing.workEnd) {
            return {
                success: false,
                message: "既に退勤打刻済みです",
                data: null,
            }
        }

        // 残業時間と退勤タイプを計算
        const { overtimeMinutes, workEndType } = calcWorkAndOvertime(
            existing.workType,
            {
              ...existing,
              workEnd: currentTime,
            }
          );

        // 打刻データを更新
        const result =  await prisma.attendance.update({
            where: {
                userId_date: {
                    userId,
                    date: today,
                }
            },
            data: {
                workEnd: currentTime,
                workEndType,
                overtimeMinutes,
            }
        })

        return {
            success: true,
            message: "退勤打刻が完了しました",
            data: result,
        }
    } catch(error) {
        console.error(error)
        return {
            success: false,
            message: "退勤打刻に失敗しました",
            data: null,
        }
    }
}