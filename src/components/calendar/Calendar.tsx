import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";

const Calendar = () => {
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":");
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${mins}分`;
    }
  };

  const events = [
    // 通常勤務（定時内）
    {
      title: "勤務",
      start: "2025-09-27T09:00:00",
      end: "2025-09-27T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00", // 出勤時刻
        clockOut: "18:00", // 退勤時刻
        regularEnd: "18:00", // 定時
        breakTime: 60, // 休憩（分）
      },
    },
    // 残業あり勤務
    {
      title: "勤務",
      start: "2025-09-28T09:00:00",
      end: "2025-09-28T20:00:00", // 20時まで働いた
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "20:00",
        regularEnd: "18:00", // 定時は18時
        breakTime: 60,
      },
    },
    // 有給
    {
      title: "有給休暇",
      start: "2025-09-29T00:00:00",
      end: "2025-09-29T23:59:59",
      extendedProps: {
        type: "paid",
      },
    },
    // 欠勤
    {
      title: "欠勤",
      start: "2025-09-26T00:00:00",
      end: "2025-09-26T23:59:59",
      extendedProps: {
        type: "absenteeism",
      },
    },
    // 夜勤
    {
      title: "夜勤",
      start: "2025-09-30T22:00:00",
      end: "2025-10-01T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
  ];

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      height="auto"
      events={events}
      eventDisplay="block"
      eventContent={(arg) => {
        console.log(arg.timeText);
        const extendProps = arg.event.extendedProps;
        const type = arg.event.extendedProps.type;

        // typeによって背景色を決める
        let bgColor = "bg-blue-500";
        let textColor = "text-white";

        if (type === "attendance") {
          bgColor = "bg-green-500";
        } else if (type === "overtime") {
          bgColor = "bg-orange-500";
        } else if (type === "paid") {
          bgColor = "bg-yellow-400";
          textColor = "text-black";
        } else if (type === "absenteeism") {
          bgColor = "bg-red-600";
        } else if (type === "nightShift") {
          bgColor = "bg-purple-600";
        }

        let overTimeDisplay = "";
        if (type === "workday") {
          const clockInMinutes = timeToMinutes(extendProps.clockIn);
          const clockOutMinutes = timeToMinutes(extendProps.clockOut);
          const regularEndMinutes = timeToMinutes(extendProps.regularEnd);

          // 総労働時間（休憩を引く）
          const totalWorkMinutes =
            clockOutMinutes - clockInMinutes - extendProps.breakTime;

          // 定時労働時間（休憩を引く）
          const regularWorkMinutes =
            regularEndMinutes - clockInMinutes - extendProps.breakTime;

          // 残業時間を計算
          if (totalWorkMinutes > regularWorkMinutes) {
            const overTimeMinutes = totalWorkMinutes - regularWorkMinutes;
            overTimeDisplay = minutesToTime(overTimeMinutes);
          }
        }

        return (
          <div className={`${bgColor} ${textColor} p-1 rounded text-xs`}>
            <div className="flex items-center space-x-1">
              {arg.timeText && arg.timeText !== "0時" && (
                <div>{arg.timeText}</div>
              )}
              <div className="">{arg.event.title}</div>
            </div>
            <div>
              {type === "workday" && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <span>{extendProps.clockIn}</span>
                    <span>-</span>
                    <span>{extendProps.clockOut}</span>
                  </div>
                  {extendProps.clockOut > extendProps.regularEnd && (
                    <span>残業時間:{overTimeDisplay}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default Calendar;
