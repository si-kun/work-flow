"use client";

import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { minutesToTime, timeToMinutes } from "@/utils/timeUtils";

interface CalendarProps {
  setPaidLeaveDays: React.Dispatch<React.SetStateAction<number>>;
  setAcquiredPaidLeaveDays: React.Dispatch<React.SetStateAction<number>>;
  setWorkingHours: React.Dispatch<React.SetStateAction<number>>;
  setOvertimeHours: React.Dispatch<React.SetStateAction<number>>;
  setAbsentDays: React.Dispatch<React.SetStateAction<number>>;
  setNightShiftHours: React.Dispatch<React.SetStateAction<number>>;
}

interface Event {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    type: "workday" | "nightShift" | "paid" | "paidPending" | "absenteeism";
    clockIn: string;
    clockOut: string;
    regularEnd: string;
    breakTime: number;
  };
}

const Calendar = ({
  setPaidLeaveDays,
  setAcquiredPaidLeaveDays,
  setWorkingHours,
  setOvertimeHours,
  setAbsentDays,
  setNightShiftHours,
}: CalendarProps) => {

  const events = [
    // 9月1日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-01T09:00:00",
      end: "2025-09-01T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月2日 - 残業1時間
    {
      title: "勤務",
      start: "2025-09-02T09:00:00",
      end: "2025-09-02T19:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "19:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月3日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-03T09:00:00",
      end: "2025-09-03T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月4日 - 残業3時間
    {
      title: "勤務",
      start: "2025-09-04T09:00:00",
      end: "2025-09-04T21:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "21:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月5日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-05T09:00:00",
      end: "2025-09-05T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月6日・7日 - 土日休み（データなし）

    // 9月8日 - 夜勤（9日6時まで）
    {
      title: "夜勤",
      start: "2025-09-08T22:00:00",
      end: "2025-09-09T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
    // 9月9日 - 夜勤（10日6時まで）
    {
      title: "夜勤",
      start: "2025-09-09T22:00:00",
      end: "2025-09-10T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
    // 9月10日 - 夜勤（11日6時まで）
    {
      title: "夜勤",
      start: "2025-09-10T22:00:00",
      end: "2025-09-11T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
    // 9月11日 - 夜勤（12日6時まで）
    {
      title: "夜勤",
      start: "2025-09-11T22:00:00",
      end: "2025-09-12T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
    // 9月12日 - 夜勤（13日6時まで）
    {
      title: "夜勤",
      start: "2025-09-12T22:00:00",
      end: "2025-09-13T06:00:00",
      extendedProps: {
        type: "nightShift",
        clockIn: "22:00",
        clockOut: "06:00",
        regularEnd: "06:00",
        breakTime: 60,
      },
    },
    // 9月13日・14日 - 土日休み

    // 9月15日 - 申請中の有給
    {
      title: "有給申請中",
      start: "2025-09-15T00:00:00",
      end: "2025-09-15T23:59:59",
      extendedProps: {
        type: "paidPending", // 申請中
      },
    },
    // 9月16日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-16T09:00:00",
      end: "2025-09-16T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月17日 - 残業4時間
    {
      title: "勤務",
      start: "2025-09-17T09:00:00",
      end: "2025-09-17T22:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "22:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月18日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-18T09:00:00",
      end: "2025-09-18T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月19日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-19T09:00:00",
      end: "2025-09-19T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月20日・21日 - 土日休み

    // 9月22日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-22T09:00:00",
      end: "2025-09-22T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月23日 - 祝日（休み）

    // 9月24日 - 残業1.5時間
    {
      title: "勤務",
      start: "2025-09-24T09:00:00",
      end: "2025-09-24T19:30:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "19:30",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月25日 - 通常勤務
    {
      title: "勤務",
      start: "2025-09-25T09:00:00",
      end: "2025-09-25T18:00:00",
      extendedProps: {
        type: "workday",
        clockIn: "09:00",
        clockOut: "18:00",
        regularEnd: "18:00",
        breakTime: 60,
      },
    },
    // 9月26日 - 欠勤
    {
      title: "欠勤",
      start: "2025-09-26T00:00:00",
      end: "2025-09-26T23:59:59",
      extendedProps: {
        type: "absenteeism",
      },
    },
    // 9月27日・28日 - 土日休み

    // 9月29日 - 有給休暇
    {
      title: "有給休暇",
      start: "2025-09-29T00:00:00",
      end: "2025-09-29T23:59:59",
      extendedProps: {
        type: "paid",
      },
    },
    // 9月30日 - 夜勤（10月1日まで）
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
  ] as Event[];

  // 有給休暇日数を計算
  const calcAcquiredPaidLeaveDays = (events: Event[]) => {
    const count = events.reduce(
      (acc, ev) =>
        ev.title === "paid" || ev.extendedProps?.type === "paid"
          ? acc + 1
          : acc,
      0
    );
    setAcquiredPaidLeaveDays(count);
  };

  // 総労働時間をset関数に
  const calcWorkingHours = (events: Event[]) => {
    const totalWorkMinutes = events.reduce((acc, ev) => {
      const { workMinutes } = calcWorkAndOvertime(
        ev.extendedProps.type,
        ev.extendedProps
      );
      return acc + workMinutes;
    }, 0);
    setWorkingHours(totalWorkMinutes / 60);
  };

  // 夜勤時間をset関数に
  const calcNightShiftHours = (events: Event[]) => {
    const totalNightShiftMinutes = events.reduce((acc, ev) => {
      const { nightShiftMinutes } = calcWorkAndOvertime(
        ev.extendedProps.type,
        ev.extendedProps
      );
      return acc + nightShiftMinutes;
    }, 0);
    setNightShiftHours(totalNightShiftMinutes / 60);
  };

  // 残業時間をset関数に
  const setOvertime = (events: Event[]) => {
    const totalOvertimeMinutes = events.reduce((acc, ev) => {
      const { overtimeMinutes } = calcWorkAndOvertime(
        ev.extendedProps.type,
        ev.extendedProps
      );
      return acc + overtimeMinutes;
    }, 0);
    setOvertimeHours(totalOvertimeMinutes / 60);
  };

  // 欠勤日数を取得
  const caclAbsentDays = (events: Event[]) => {
    const count = events.reduce((acc, ev) => {
      return ev.extendedProps?.type === "absenteeism" ? acc + 1 : acc;
    }, 0);
    setAbsentDays(count);
  };

  const calcWorkAndOvertime = (
    type: string,
    extendProps: {
      clockIn?: string;
      clockOut?: string;
      regularEnd?: string;
      breakTime?: number;
    }
  ): {
    workMinutes: number;
    regularMinutes: number;
    overtimeMinutes: number;
    nightShiftMinutes: number;
    nightShiftDisplay: string;
    workDisplay: string;
    overtimeDisplay: string;
  } => {
    // ステップ1: 勤務日以外(有給、欠勤など)は0を返す
    if (type !== "workday" && type !== "nightShift") {
      return {
        workMinutes: 0,
        regularMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    // ステップ2: 必要なデータがあるかチェック
    if (
      !extendProps.clockIn ||
      !extendProps.clockOut ||
      extendProps.breakTime === undefined
    ) {
      return {
        workMinutes: 0,
        regularMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    // ステップ3: 基本的な計算
    const clockInMinutes = timeToMinutes(extendProps.clockIn);
    let clockOutMinutes = timeToMinutes(extendProps.clockOut);
    const breakTime = extendProps.breakTime;

    // 日付またぎの調整
    if (clockOutMinutes < clockInMinutes) {
      clockOutMinutes += 1440;
    }

    const workMinutes = clockOutMinutes - clockInMinutes - breakTime;

    // ステップ4: 夜勤時間を計算(常に計算する)
    const nightShiftMinutes = calcNightShiftMinutes(extendProps);

    // ステップ5: 夜勤シフトの場合
    if (type === "nightShift") {
      return {
        workMinutes,
        regularMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes,
        nightShiftDisplay:
          nightShiftMinutes > 0 ? minutesToTime(nightShiftMinutes) : "",
        workDisplay: minutesToTime(workMinutes),
        overtimeDisplay: "",
      };
    }

    // ステップ6: 通常勤務の場合
    if (!extendProps.regularEnd) {
      return {
        workMinutes: 0,
        regularMinutes: 0,
        overtimeMinutes: 0,
        nightShiftMinutes: 0,
        nightShiftDisplay: "",
        workDisplay: "",
        overtimeDisplay: "",
      };
    }

    let regularEndMinutes = timeToMinutes(extendProps.regularEnd);

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
      regularMinutes,
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
  const calcNightShiftMinutes = (extendProps: {
    clockIn?: string;
    clockOut?: string;
    breakTime?: number;
  }): number => {
    if (
      !extendProps.clockIn ||
      !extendProps.clockOut ||
      extendProps.breakTime === undefined
    ) {
      return 0;
    }
    const clockInMinutes = timeToMinutes(extendProps.clockIn); // 1200
    let clockOutMinutes = timeToMinutes(extendProps.clockOut); // 360

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
  }, [events]);

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

        // 残業時間を計算
        const { overtimeDisplay } = calcWorkAndOvertime(type, extendProps);

        return (
          <div className={`${bgColor} ${textColor} p-1 rounded text-xs`}>
            <div className="flex items-center space-x-1">
              {/* {arg.timeText && arg.timeText !== "0時" && (
                <div>{arg.timeText}</div>
              )} */}
              <div className="">
                {(arg.event.title === "有給休暇" ||
                  arg.event.title === "有給申請中" ||
                  arg.event.title === "欠勤") &&
                  arg.event.title}
              </div>
            </div>
            <div>
              {(type === "workday" || type === "nightShift") && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <span>{extendProps.clockIn}</span>
                    <span>-</span>
                    <span>{extendProps.clockOut}</span>
                  </div>
                  {extendProps.clockOut > extendProps.regularEnd && (
                    <span>残業時間:{overtimeDisplay}</span>
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
