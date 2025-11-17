import { TableHeader } from "./employee";

interface ShiftSettings {
  start: string;
  end: string;
  earlyClockInWindow: number;
}


export interface MonthlySummaryData {
  userId: string;
  name: string;
  department: string;
  position: string;
  totalWorkHours: number;
  nightWorkHours: number;
  overtimeHours: number;
  paidLeaveUsed: number;
  paidLeaveRemaining: number;
  absentDays: number;
  role: string;
}

export const SHIFT_SETTINGS: Record<string, ShiftSettings> = {
  day_working: {
    start: "8:00",
    end: "17:00",
    earlyClockInWindow: 30,
  },
  night_working: {
    start: "20:00",
    end: "5:00",
    earlyClockInWindow: 30,
  },
} as const;

export const ATTENDANCE_TABLE_HEADER: TableHeader[] = [
  { id: "name", label: "名前", width: "300px" },
  { id: "department", label: "部署", width: "200px" },
  { id: "position", label: "役職", width: "200px" },
  { id: "totalWorkHours", label: "総勤務時間", width: "180px" },
  { id: "nightWorkHours", label: "夜勤時間", width: "180px" },
  { id: "overtimeMinutes", label: "残業時間", width: "180px" },
  { id: "paidLeave", label: "有給取得/残", width: "180px" },
  { id: "absentDays", label: "欠勤日数", width: "180px" },
];

export const ATTENDANCE_DIALOG_HEADER: TableHeader[] = [
  { id: "date", label: "日付", width: "200px" },
  { id: "workType", label: "勤務形態", width: "200px" },
  { id: "clockIn", label: "出勤時刻", width: "120px" },
  { id: "clockInStatus", label: "出勤状況", width: "120px" },
  { id: "clockOut", label: "退勤時刻", width: "120px" },
  { id: "clockOutStatus", label: "退勤状況", width: "120px" },
  { id: "breakStart", label: "休憩開始", width: "120px" },
  { id: "breakEnd", label: "休憩終了", width: "120px" },
  { id: "overtime", label: "残業時間", width: "120px" },
];