"use client";

import { getTodayAttendance } from "@/actions/attendance/getTodayAttendance";
import { DailyAttendanceData } from "@/types/attendance";
import { useEffect, useState } from "react";

export const useFetchTodayAttendance = (userId: string) => {
  const [todayAttendance, setTodayAttendance] =
    useState<DailyAttendanceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTodayAttendance(userId);

        if (response.success && response.data) {
          setTodayAttendance(response.data as DailyAttendanceData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId]);

  return {
    todayAttendance,
    setTodayAttendance,
  };
};
