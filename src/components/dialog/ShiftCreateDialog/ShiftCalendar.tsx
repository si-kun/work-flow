import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import {
  EVENT_COLORS_BUTTON,
  ShiftSettingEvent,
  ShiftType,
} from "@/constants/calendarColor";
import { RefObject } from "react";
import { convertWorkTypeToJapanese } from "@/lib/convertToJapanese";
import { EventClickArg } from "@fullcalendar/core/index.js";

interface ShiftCalendarProps {
  calendarKey: number;
  events: ShiftSettingEvent[];
  handleClickDate: (info: DateClickArg) => void;
  handleEventClick: (info: EventClickArg) => void;
  year: number;
  month: number;
  isUpdatingFromCalendar: RefObject<boolean>;
  handleYearChange: (year: string) => void;
  handleMonthChange: (month: string) => void;
}

const ShiftCalendar = ({
  calendarKey,
  events,
  handleClickDate,
  handleEventClick,
  year,
  month,
  isUpdatingFromCalendar,
  handleYearChange,
  handleMonthChange,
}: ShiftCalendarProps) => {
  return (
    <FullCalendar
      key={calendarKey}
      aspectRatio={2}
      height="auto"
      plugins={[dayGridPlugin, interactionPlugin]}
      locale={jaLocale}
      events={events}
      dateClick={(info) => handleClickDate(info)}
      eventClick={(info) => handleEventClick(info)}
      fixedWeekCount={false}
      initialView="dayGridMonth"
      initialDate={new Date(year, month - 1, 1)}
      datesSet={(dateInfo) => {
        const newDate = dateInfo.view.currentStart;
        const newYear = newDate.getFullYear();
        const newMonth = newDate.getMonth() + 1;

        if (newYear !== year || newMonth !== month) {
          isUpdatingFromCalendar.current = true; // ← フラグを立てる
          handleYearChange(String(newYear));
          handleMonthChange(String(newMonth));
        }
      }}
      eventContent={(arg) => {
        const type = arg.event.title as ShiftType;
        const colors = EVENT_COLORS_BUTTON[type];

        return (
          <div
            className={`${colors.className} p-1 rounded text-xs flex justify-center hover:cursor-pointer`}
          >
            {convertWorkTypeToJapanese(type)}
          </div>
        );
      }}
    />
  );
};

export default ShiftCalendar;
