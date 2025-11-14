import { events } from "@/constants/calendarEvents";
import { CalendarEvent, MonthlyStatistics } from "@/types/attendance";
import { Attendance } from "@prisma/client";
import { atom } from "jotai";

export const eventsAtom = atom<CalendarEvent[]>(events);

export const todayAttendanceAtom = atom<Attendance | null>(null);

export const statisticsAtom = atom<MonthlyStatistics>()
