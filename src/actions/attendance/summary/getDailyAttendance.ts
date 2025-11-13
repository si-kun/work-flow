"use server";

import { ApiResponse } from "@/types/api/api";
import { DailyAttendanceData } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";

export const getDailyAttendance = async(userId: string, year: number, month: number):Promise<ApiResponse<DailyAttendanceData[]>> => {
    try {

        const startDate = new Date(year, month -1, 1);
        const endDate = new Date(year, month, 0);

        const user = await prisma.user.findUnique({
            where: { id: userId},
            include: {
                attendances: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        }
                    }
                }
            }
        })

        if(!user) {
            return {
                success: false,
                message: "ユーザーが存在しません",
                data: [],
            }
        }

        const attendanceData: DailyAttendanceData[] = user.attendances.map(att => ({
            date: att.date,
            workType: att.workType as DailyAttendanceData["workType"],
            workStart: att.workStart,
            workStartType: att.workStartType,
            workEnd: att.workEnd,
            workEndType: att.workEndType,
            restStart: att.restStart,
            restEnd: att.restEnd,
            overtimeMinutes: att.overtimeMinutes,
        }))

        return {
            success: true,
            message: "日次勤怠データの取得に成功しました",
            data: attendanceData,
        }
    } catch(error) {
        console.error("Error in getDailyAttendance:", error);
        return {
            success: false,
            message: "日次勤怠データの取得に失敗しました",
            data: [],
        }
    }
}