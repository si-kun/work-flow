"use client";

import { getMonthlyAttendance } from "@/actions/attendance/getMonthlyAttendance";
import { eventsAtom, statisticsAtom } from "@/atoms/attendance";
import { Attendance, DailyWorkType } from "@prisma/client";
import { format } from "date-fns";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

export const useFetchAttendance = (
  userId: string,
  year: number,
  month: number
) => {
  const setEvents = useSetAtom(eventsAtom);
  const setStatistics = useSetAtom(statisticsAtom)

  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getMonthlyAttendance({ userId, year, month });
      if (response.success && response.data) {
        setEvents(
          response.data.attendances
            .filter((att): att is Attendance & { workType: DailyWorkType } =>
              att.workType !== null
            ) // 型ガードでnullを除外
            .map((att) => ({
              title: att.workType,
              start: format(att.date, "yyyy-MM-dd"),
              end: format(att.date, "yyyy-MM-dd"),
              extendedProps: att,
            }))
        );
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, year, month]);

  return {
    refetch: fetchData,
    loading,
  };
};
