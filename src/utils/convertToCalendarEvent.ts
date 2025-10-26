import { DailyAttendanceData, DAILY_WORK } from "@/types/attendance";
import { addDays, format } from "date-fns";
import { timeToMinutes } from "./timeUtils";

export const convertToCalendarEvent = (data: DailyAttendanceData) => {
    // DailyWorkからタイトルを取得
  const title =
  DAILY_WORK.find((work) => work.value === data.workType)?.label || "";

    // 休暇系の場合
  if (
    ["paid", "paid_pending", "absenteeism", "day_off"].includes(data.workType)
  ) {
    return {
      title,
      start: format(data.date, "yyyy-MM-dd"),
      end: format(data.date, "yyyy-MM-dd"),
      allDay: true,
      extendedProps: {
        ...data,
        overtimeMinutes: 0,
        workStartType: null,
        workEndType: null,
      },
    };
  }

  // 日勤、夜勤の場合
  // 夜勤の日付またぎ対応
  const workStartMinutes = timeToMinutes(data.workStart as string);
  const workEndMinutes = timeToMinutes(data.workEnd as string);
  const isNextDay = workEndMinutes < workStartMinutes; // 終了時間よりスタート時間の方が大きい場合、日付をまたいでいると判断

  const endDate = isNextDay
    ? format(addDays(data.date, 1), "yyyy-MM-dd")
    : format(data.date, "yyyy-MM-dd");

  return {
    title,
    start: `${format(data.date, "yyyy-MM-dd")}T${data.workStart}`,
    end: `${endDate}T${data.workEnd}`,
    allDay: false,
    extendedProps: data,
  };
};

