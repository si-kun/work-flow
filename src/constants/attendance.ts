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

export const ATTENDANCE_TABLE_HEADER = [
  { id: "name", label: "名前" },
  { id: "department", label: "部署" },
  { id: "position", label: "役職" },
  { id: "totalWorkHours", label: "総勤務時間" },
  { id: "nightWorkHours", label: "夜勤時間" },
  { id: "overtimeMinutes", label: "残業時間" },
  { id: "paidLeave", label: "有給取得/残" },
  { id: "absentDays", label: "欠勤日数" },
];

export const ATTENDANCE_DIALOG_HEADER = [
  "日付",
  "勤務形態",
  "出勤時刻",
  "出勤状況",
  "退勤時刻",
  "退勤状況",
  "休憩開始",
  "休憩終了",
  "残業時間",
]