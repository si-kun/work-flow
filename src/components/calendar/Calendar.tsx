"use client";

import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { CalendarEvent } from "@/types/attendance";
// import { events } from "@/constants/calendarEvents";
import { isSameMonth } from "date-fns";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";

interface CalendarProps {
  setAcquiredPaidLeaveDays: React.Dispatch<React.SetStateAction<number>>;
  setWorkingHours: React.Dispatch<React.SetStateAction<number>>;
  setOvertimeHours: React.Dispatch<React.SetStateAction<number>>;
  setAbsentDays: React.Dispatch<React.SetStateAction<number>>;
  setNightShiftHours: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  displayMonth: Date;
  setDisplayMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar = ({
  setAcquiredPaidLeaveDays,
  setWorkingHours,
  setOvertimeHours,
  setAbsentDays,
  setNightShiftHours,
  setSelectedDate,
  displayMonth,
  setDisplayMonth,
}: CalendarProps) => {
  const calenderRef = useRef<FullCalendar>(null);

  const events = useAtomValue(eventsAtom);

  // 有給休暇日数を計算
  const calcAcquiredPaidLeaveDays = (events: CalendarEvent[]) => {
    const count = events.reduce(
      (acc, ev) => (ev.extendedProps.workType === "paid" ? acc + 1 : acc),
      0
    );
    setAcquiredPaidLeaveDays(count);
  };

  // 総労働時間をset関数に
  const calcWorkingHours = (events: CalendarEvent[]) => {
    const totalWorkMinutes = events.reduce((acc, ev) => {
      const { workMinutes } = calcWorkAndOvertime(
        ev.extendedProps.workType!,
        ev.extendedProps
      );
      return acc + workMinutes;
    }, 0);

    setWorkingHours(totalWorkMinutes);
  };

  // 夜勤時間をset関数に
  const calcNightShiftHours = (events: CalendarEvent[]) => {
    const totalNightShiftMinutes = events.reduce((acc, ev) => {
      const { nightShiftMinutes } = calcWorkAndOvertime(
        ev.extendedProps.workType!,
        ev.extendedProps
      );
      return acc + nightShiftMinutes;
    }, 0);
    setNightShiftHours(totalNightShiftMinutes);
  };

  // 残業時間をset関数に
  const setOvertime = (events: CalendarEvent[]) => {
    const totalOvertimeMinutes = events.reduce((acc, ev) => {
      const { overtimeMinutes } = calcWorkAndOvertime(
        ev.extendedProps.workType!,
        ev.extendedProps
      );
      return acc + overtimeMinutes;
    }, 0);
    setOvertimeHours(totalOvertimeMinutes);
  };

  // 欠勤日数を取得
  const caclAbsentDays = (events: CalendarEvent[]) => {
    const count = events.reduce((acc, ev) => {
      return ev.extendedProps?.workType === "absenteeism" ? acc + 1 : acc;
    }, 0);
    setAbsentDays(count);
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
    calcAcquiredPaidLeaveDays(filteredEvents);
    setOvertime(filteredEvents);
    caclAbsentDays(filteredEvents);
    calcWorkingHours(filteredEvents);
    calcNightShiftHours(filteredEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMonth, events]);

  const handleSelectEvent = (info: any) => {
    setSelectedDate(info.event.extendedProps.date);
    console.log(info.event.extendedProps.date);
  };

  const handleDateClick = (info: any) => {
    // クリックされた日付を取得
    setSelectedDate(info.dateStr);
    console.log(info.dateStr);
  };

  return (
    <FullCalendar
      ref={calenderRef}
      datesSet={handleDatesSet}
      locale={jaLocale}
      plugins={[dayGridPlugin,interactionPlugin]}
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
          bgColor = "bg-orange-500";
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
                {(arg.event.title === "有給休暇" ||
                  arg.event.title === "有給申請中" ||
                  arg.event.title === "欠勤" ||
                  arg.event.title === "休日") &&
                  arg.event.title}
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
