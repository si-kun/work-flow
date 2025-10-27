"use client"

import { getDailyAttendance } from "@/actions/attendance/summary/getDailyAttendance"
import { eventsAtom } from "@/atoms/attendance"
import { format } from "date-fns"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

export const useFetchAttendance = (userId: string, year: number, month: number) => {

    const setEvents = useSetAtom(eventsAtom)

    useEffect(() => {
        const fetchAttendance = async () => {
          try {
            const response = await getDailyAttendance(userId, year, month);
            if (response.success) {
              setEvents(
                response.data.map((att) => ({
                  title: att.workType,
                  start: format(att.date, "yyyy-MM-dd"),
                  end: format(att.date, "yyyy-MM-dd"),
                  extendedProps: att,
                }))
              );
            } else {
              return [];
            }
          } catch (error) {
            console.error("Error fetching events:", error);
            return [];
          }
        };
        fetchAttendance();
      }, [userId,year, month, setEvents]);
}