"use client";

import { GetTodayAttendance } from "@/actions/attendance/getTodayAttendance";
import { DailyAttendanceData } from "@/types/attendance";
import { useEffect, useState } from "react";

export const useFetchTodayAttendance = (userId: string) => {
  const [todayAttendance, setTodayAttendance] =
    useState<DailyAttendanceData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetTodayAttendance(userId);

        if (response.success && response.data) {
          setTodayAttendance(response.data);
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
