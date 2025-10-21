"use client";

import { getMonthlySummary } from "@/actions/attendance/summary/getMonthlySummary";
import { MonthlySummaryData } from "@/constants/attendance";
import { useEffect, useState } from "react";

interface useAttendanceDataProps {
  year: number;
  month: number;
}

export const useAttendanceData = ({
  year,
  month,
}: useAttendanceDataProps  ) => {
  const [attendanceData, setAttendanceData] = useState<
    MonthlySummaryData[]
  >([]);

  useEffect(() => {
    const getAllAttendanceData = async () => {
      try {
        const response = await getMonthlySummary(year, month);

        if (response.success) {
          setAttendanceData(response.data);
        }
      } catch (error) {
        console.error("ユーザーの取得に失敗しました:", error);
      }
    };
    getAllAttendanceData();
  }, [year, month]);

  return {attendanceData}
};