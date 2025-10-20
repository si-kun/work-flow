"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";

interface DepartmentAndOvertime {
  department: string;
  total: number;
  count: number;
}

export interface DepartmentOvertimeResult {
    department: string;
    overtime: number;
  }


type DepartmentOvertimeMapValue = Record<string, DepartmentAndOvertime>;

export const getDepartmentOvertimeSummary = async (
  year: number,
  month: number
):Promise<ApiResponse<DepartmentOvertimeResult[]>> => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // ユーザーごとの残業時間を取得
    const attendanceSums = await prisma.attendance.groupBy({
      by: ["userId"],
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        overtimeMinutes: true,
      },
    });

    // 対象ユーザーの部署を取得
    const userDepartments = await prisma.user.findMany({
      select: {
        id: true,
        department: true,
      },
    });

    // 部署ごとに残業時間を集計
    const departmentOvertimeMap =
      attendanceSums.reduce<DepartmentOvertimeMapValue>((map, attendance) => {
        const user = userDepartments.find((u) => u.id === attendance.userId);

        if (user) {
          const department = user.department || "未配属";
          const overtime = attendance._sum.overtimeMinutes || 0;
          if (map[department]) {
            map[department].total += overtime;
            map[department].count += 1;
          } else {
            map[department] = {
              department,
              total: overtime,
              count: 1,
            };
          }
        }
        return map;
      }, {});

    // 平均を計算して配列に変換(分単位のまま)
    const departmentOvertimeArray = Object.entries(departmentOvertimeMap).map(
      ([dept, data]) => ({
        department: dept,
        overtime: Math.round(data.total / data.count), // 平均残業時間(分)
      })
    );

    return {
      success: true,
      message: "部署別残業時間集計の取得に成功しました",
      data: departmentOvertimeArray,
    };
  } catch (error) {
    console.error("部署別残業時間集計の取得エラー:", error);
    return {
      success: false,
      message: "部署別残業時間集計の取得に失敗しました",
      data: [],
    };
  }
};
