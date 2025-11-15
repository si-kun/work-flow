"use client";

import React, {useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { CalendarEvent, DAILY_WORK, DailyWorkType } from "@/types/attendance";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { EventClickArg, EventContentArg } from "@fullcalendar/core/index.js";
import { isWorkingType } from "@/utils/attendanceUtils";
import { EVENT_COLORS } from "@/constants/calendarColor";

interface CalendarProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  displayMonth: Date;
}

const Calendar = ({ setSelectedDate, displayMonth }: CalendarProps) => {
  const calenderRef = useRef<FullCalendar>(null);

  const eventAtom = useAtomValue(eventsAtom);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(new Date(info.dateStr)); // 文字列 → Date に変換
  };

  const handleSelectEvent = (info: EventClickArg) => {
    setSelectedDate(info.event.extendedProps.date); // すでに Date
  };

  const getEventColors = (type: DailyWorkType) => {
    return (
      EVENT_COLORS[type] || { bgColor: "bg-blue-500", textColor: "text-white" }
    );
  };

  return (
    <FullCalendar
      ref={calenderRef}
      key={displayMonth.toISOString().slice(0.7)}
      initialDate={displayMonth}
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      height="auto"
      dateClick={handleDateClick}
      events={eventAtom}
      headerToolbar={false}
      eventDisplay="block"
      eventContent={(arg: EventContentArg) => {
        const extendProps = arg.event
          .extendedProps as CalendarEvent["extendedProps"];
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
