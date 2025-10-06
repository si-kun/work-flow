"use client";

import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { minutesToTime, timeToMinutes } from "@/utils/timeUtils";
import { AttendanceData, CalendarEvent } from "@/types/attendance";
import { events } from "@/constants/calendarEvents";
import { SHIFT_SETTINGS } from "@/constants/attendance";
import { format } from "date-fns";

interface CalendarProps {
  setAcquiredPaidLeaveDays: React.Dispatch<React.SetStateAction<number>>;
  setWorkingHours: React.Dispatch<React.SetStateAction<number>>;
  setOvertimeHours: React.Dispatch<React.SetStateAction<number>>;
  setAbsentDays: React.Dispatch<React.SetStateAction<number>>;
  setNightShiftHours: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAttendance: React.Dispatch<React.SetStateAction<AttendanceData>>;
}

const Calendar = ({
  setAcquiredPaidLeaveDays,
  setWorkingHours,
  setOvertimeHours,
  setAbsentDays,
  setNightShiftHours,
  setSelectedAttendance,
}: CalendarProps) => {
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
      console.log('イベント:', ev.extendedProps.date, 'workMinutes:', workMinutes); // ←追加
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

  // 休憩時間の計算
  const calcBreakMinutes = (restStart: string, restEnd: string): number => {
    if (!restStart || !restEnd) return 0;

    const startMinutes = timeToMinutes(restStart);
    const endMinutes = timeToMinutes(restEnd);

    return endMinutes - startMinutes;
  };

  const calcWorkAndOvertime = (
    type: string,
    extendProps: AttendanceData
  ): {
    workMinutes: number;
    overtimeMinutes: number;
    nightShiftMinutes: number;
    nightShiftDisplay: string;
    workDisplay: string;
    overtimeDisplay: string;
  } => {
    // ステップ1: 勤務日以外(有給、欠勤など)は0を返す
    if (
      extendProps.workType !== "day_working" &&
      extendProps.workType !== "night_working"
    ) {
      return {
        workMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    // ステップ2: 必要なデータがあるかチェック
    if (!extendProps.workStart || !extendProps.workEnd) {
      return {
        workMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    // ステップ3: 基本的な計算
    const clockInMinutes = timeToMinutes(extendProps.workStart);
    let clockOutMinutes = timeToMinutes(extendProps.workEnd);
    const breakTime = calcBreakMinutes(
      extendProps.restStart || "",
      extendProps.restEnd || ""
    );

    // 日付またぎの調整
    if (clockOutMinutes < clockInMinutes) {
      clockOutMinutes += 1440;
    }

    const workMinutes = clockOutMinutes - clockInMinutes - breakTime;

    // ステップ4: 夜勤時間を計算(常に計算する)
    const nightShiftMinutes = calcNightShiftMinutes(
      clockInMinutes,
      clockOutMinutes);

    // ステップ5: 夜勤シフトの場合
    if (type === "night_working") {
      return {
        workMinutes,
        overtimeMinutes: 0,
        nightShiftMinutes,
        nightShiftDisplay:
          nightShiftMinutes > 0 ? minutesToTime(nightShiftMinutes) : "",
        workDisplay: minutesToTime(workMinutes),
        overtimeDisplay: "",
      };
    }

    // ステップ6: 通常勤務の場合
    if (extendProps.workEndType === "on_time") {
      return {
        workMinutes,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    let regularEndMinutes = timeToMinutes(SHIFT_SETTINGS.day_working.end);

    // 定時も日付またぎ調整
    if (regularEndMinutes < clockInMinutes) {
      regularEndMinutes += 1440;
    }

    const regularMinutes = regularEndMinutes - clockInMinutes - breakTime;

    // 残業時間を計算
    const overtimeMinutes =
      workMinutes > regularMinutes ? workMinutes - regularMinutes : 0;

    return {
      workMinutes,
      overtimeMinutes,
      nightShiftMinutes,
      nightShiftDisplay:
        nightShiftMinutes > 0 ? minutesToTime(nightShiftMinutes) : "",
      workDisplay: minutesToTime(workMinutes),
      overtimeDisplay:
        overtimeMinutes > 0 ? minutesToTime(overtimeMinutes) : "",
    };
  };

  // 夜勤の時間を計算 (22時〜翌5時 20時出勤～6時退勤の場合)
  const calcNightShiftMinutes = (
    clockInMinutes: number,
    clockOutMinutes: number,
  ): number => {
    if (Number.isNaN(clockInMinutes) || Number.isNaN(clockOutMinutes)) {
      return 0;
    }

    // 日付をまたいでいる場合
    if (clockOutMinutes < clockInMinutes) {
      clockOutMinutes += 24 * 60; // 360 < 1200 なので 360 + 1440 = 1800
    }

    // 夜勤の時間を定義
    const nightStart = 22 * 60; // 22:00
    const nightEnd = 5 * 60 + 24 * 60; // 翌日5:00

    // 重なり部分の開始と終了を計算
    const overlapStart = Math.max(clockInMinutes, nightStart); // 1200 , 1320 -> 1320
    const overlapEnd = Math.min(clockOutMinutes, nightEnd); // 1800 , 1740 -> 1740

    // 夜勤時間を計算
    const nightShiftMinutes = overlapEnd - overlapStart; // 1740 - 1320 = 420

    // マイナスになる場合は0を返す
    return nightShiftMinutes > 0 ? nightShiftMinutes : 0; // 420 > 0 なので 420 を返す
  };

  useEffect(() => {
    calcAcquiredPaidLeaveDays(events);
    setOvertime(events);
    caclAbsentDays(events);
    calcWorkingHours(events);
    calcNightShiftHours(events);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const handleSelectEvent = (eventInfo: any) => {
    const event = eventInfo.event;
    const extendProps = event.extendedProps;

    console.log(eventInfo)

    setSelectedAttendance((prev) => ({
      ...prev,
      date: format(new Date(event.start!), "yyyy-MM-dd"),
      workType: extendProps.workType,
      workStart: extendProps.workStart,
      workStartType: extendProps.workStartType,
      workEnd: extendProps.workEnd,
      workEndType: extendProps.workEndType,
      restStart: extendProps.restStart,
      restEnd: extendProps.restEnd,
      overtimeMinutes: extendProps.overtimeMinutes,
    }));
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      height="auto"
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
