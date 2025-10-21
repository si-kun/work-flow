import { events } from "@/constants/calendarEvents";
import { CalendarEvent } from "@/types/attendance";
import { atom } from "jotai";

export const eventsAtom = atom<CalendarEvent[]>(events);
