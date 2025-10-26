"use client";

import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { CalendarEvent, DAILY_WORK, MonthlyStatistics } from "@/types/attendance";
import { isSameMonth } from "date-fns";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";

interface CalendarProps {
  setStats:  React.Dispatch<React.SetStateAction<MonthlyStatistics>>
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  displayMonth: Date;
  setDisplayMonth: React.Dispatch<React.SetStateAction<Date>>;
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
    console.log("date click", new Date(info.dateStr));
  };

  const handleSelectEvent = (info: any) => {
    setSelectedDate(info.event.extendedProps.date); // すでに Date
    console.log("select click", info.event.extendedProps.date);
  };

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
      eventContent={(arg) => {
        const extendProps = arg.event.extendedProps;
        const type = arg.event.extendedProps.workType;

        // typeによって背景色を決める
        let bgColor = "bg-blue-500";
        let textColor = "text-white";

        if (type === "day_working") {
          bgColor = "bg-green-500";
        } else if (type === "overtime") {
          bgColor = "bg-orange-600";
        } else if (type === "paid") {
          bgColor = "bg-yellow-400";
          textColor = "text-black";
        } else if (type === "absenteeism") {
          bgColor = "bg-red-600";
        } else if (type === "night_working") {
          bgColor = "bg-purple-600";
        } else if (type === "day_off") {
          bgColor = "bg-gray-400";
          textColor = "text-black";
        }
        return (
          <div className={`${bgColor} ${textColor} p-1 rounded text-xs`}>
            <div className="flex items-center space-x-1">
              <div className="">
                {["paid", "paid_pending", "absenteeism", "day_off"].includes(
                  arg.event.title
                ) && convertToJapanese(arg.event.title, DAILY_WORK)}
              </div>
            </div>
            <div>
              {(type === "day_working" || type === "night_working") && (
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
