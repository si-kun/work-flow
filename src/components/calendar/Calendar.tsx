"use client";

import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { CalendarEvent, DAILY_WORK, DailyWorkType, MonthlyStatistics } from "@/types/attendance";
import { isSameMonth } from "date-fns";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { isWorkingType } from "@/utils/attendanceUtils";

interface CalendarProps {
  setStats:  React.Dispatch<React.SetStateAction<MonthlyStatistics>>
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  displayMonth: Date;
  setDisplayMonth: React.Dispatch<React.SetStateAction<Date>>;
}

interface EventColors {
  bgColor: string;
  textColor: string;
}

const Calendar = ({
  setStats,
  setSelectedDate,
  displayMonth,
  setDisplayMonth,
}: CalendarProps) => {
  const calenderRef = useRef<FullCalendar>(null);

  const events = useAtomValue(eventsAtom);

  const calculateStatistics = (events: CalendarEvent[]) => {
    const result = events.reduce<MonthlyStatistics>(
      (acc, ev) => {
        const { workMinutes, overtimeMinutes, nightShiftMinutes } =
          calcWorkAndOvertime(ev.extendedProps.workType, ev.extendedProps);

        return {
          paidLeaveDays:
            acc.paidLeaveDays + (ev.extendedProps.workType === "paid" ? 1 : 0),
          acquiredPaidLeaveDays: acc.acquiredPaidLeaveDays + (ev.extendedProps.workType === "paid_pending" ? 1 : 0),
          workingMinutes: acc.workingMinutes + workMinutes,
          nightShiftMinutes: acc.nightShiftMinutes + nightShiftMinutes,
          overtimeMinutes: acc.overtimeMinutes + overtimeMinutes,
          absentDays:
            acc.absentDays +
            (ev.extendedProps.workType === "absenteeism" ? 1 : 0),
        };
      },
      {
        paidLeaveDays: 0,
        acquiredPaidLeaveDays: 0,
        workingMinutes: 0,
        nightShiftMinutes: 0,
        overtimeMinutes: 0,
        absentDays: 0,
      }
    );

    setStats(result);
  };

  const handleDatesSet = (dateInfo: any) => {
    setDisplayMonth(dateInfo.view.currentStart);
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.extendedProps.date);
    const result = isSameMonth(eventDate, displayMonth);
    return result;
  });

  useEffect(() => {
    calculateStatistics(filteredEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMonth, events]);

  const handleDateClick = (info: any) => {
    setSelectedDate(new Date(info.dateStr)); // 文字列 → Date に変換
  };

  const handleSelectEvent = (info: any) => {
    setSelectedDate(info.event.extendedProps.date); // すでに Date
  };

  const EVENT_COLORS: Record<DailyWorkType, EventColors> = {
    "day_working": { bgColor: "bg-green-500", textColor: "text-white" },
    "night_working": { bgColor: "bg-purple-600", textColor: "text-white" },
    "paid": { bgColor: "bg-yellow-400", textColor: "text-black" },
    "paid_pending": { bgColor: "bg-yellow-200", textColor: "text-black" },
    "absenteeism": { bgColor: "bg-red-600", textColor: "text-white" },
    "day_off": { bgColor: "bg-gray-400", textColor: "text-black" },
  } as const;

  const getEventColors = (type: DailyWorkType) => {
    return EVENT_COLORS[type] || { bgColor: "bg-blue-500", textColor: "text-white" };
  }

  
  return (
    <FullCalendar
    ref={calenderRef}
    datesSet={handleDatesSet}
    locale={jaLocale}
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    height="auto"
    dateClick={handleDateClick}
    events={events}
    eventDisplay="block"
    eventContent={(arg: EventContentArg) => {
      const extendProps = arg.event.extendedProps as CalendarEvent["extendedProps"];
      const type = arg.event.extendedProps.workType as DailyWorkType;
      const { bgColor, textColor } = getEventColors(type);

        return (
          <div className={`${bgColor} ${textColor} p-1 rounded text-xs`}>
            <div className="flex items-center space-x-1">
              <div className="">
                {["paid", "paid_pending", "absenteeism", "day_off"].includes(
                  type
                ) && convertToJapanese(arg.event.title, DAILY_WORK)}
              </div>
            </div>
            <div>
              {isWorkingType(type) && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <span>{extendProps.workStart}</span>
                    <span>-</span>
                    <span>{extendProps.workEnd}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
      eventClick={(eventInfo) => handleSelectEvent(eventInfo)}
    />
  );
};

export default Calendar;
