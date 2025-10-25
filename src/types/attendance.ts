export type CurrentWorkStatus =
  | "day_working"
  | "night_working"
  | "rest"
  | "leave";

export type DailyWorkType = (typeof DailyWork)[number]["value"];
export type ClockInType = (typeof ClockIn)[number]["value"];
export type ClockOutType = (typeof ClockOut)[number]["value"];

export const DailyWork = [
  { label: "通常勤務", value: "day_working" },
  { label: "夜勤", value: "night_working" },
  { label: "有給休暇", value: "paid" },
  { label: "申請中の有給", value: "paid_pending" },
  { label: "欠勤", value: "absenteeism" },
  { label: "休日", value: "day_off" },
] as const;

export const ClockIn = [
  { label: "早退", value: "early_arrival" },
  { label: "時間通り", value: "on_time" },
  { label: "遅刻", value: "late" },
] as const;

export const ClockOut = [
  { label: "早退", value: "early_leave" },
  { label: "時間通り", value: "on_time" },
  { label: "残業", value: "over_time" },
] as const;

export interface DailyAttendanceData {
  date: Date;
  workType: DailyWorkType;
  workStart: string | null;
  workStartType: ClockInType | null;
  workEnd: string | null;
  workEndType: ClockOutType | null;
  restStart: string | null;
  restEnd: string | null;
  overtimeMinutes: number;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  extendedProps: DailyAttendanceData;
}

export interface AttendanceCardData {
  title: string;
  value: number;
  unit: string;
  displayValue?: string;
}

export interface MonthlyStatistics {
  paidLeaveDays: number;
  acquiredPaidLeaveDays: number;
  workingMinutes: number;
  nightShiftMinutes: number;
  overtimeMinutes: number;
  absentDays: number;
}
