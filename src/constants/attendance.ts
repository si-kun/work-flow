import { DailyAttendanceData } from "@/types/attendance";

interface ShiftSettings {
  start: string;
  end: string;
  earlyClockInWindow: number;
}

interface MonthlySummaryData {
  userId: string;
  name: string;
  department: string;
  position: string;
  totalWorkHours: number;
  nightWorkHours: number;
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
  { id: "paidLeave", label: "有給取得/残" },
  { id: "absentDays", label: "欠勤日数" },
];

export const ATTENDANCE_DIALOG_HEADER = [
  "日付",
  "勤務形態",
  "出勤状況",
  "退勤状況",
  "休憩開始",
  "休憩終了",
  "残業時間",
]

export const ATTENDANCE_DUMMY_DATA: MonthlySummaryData[] = [
  {
    userId: "1", // ReoNaのID(後で実際のIDに合わせます)
    name: "ReoNa",
    department: "営業部",
    position: "デザイナー",
    totalWorkHours: 160,
    nightWorkHours: 0,
    paidLeaveUsed: 5,
    paidLeaveRemaining: 15,
    absentDays: 0,
  },
  {
    userId: "2",
    name: "Aimer",
    department: "技術部",
    position: "エンジニア",
    totalWorkHours: 185,
    nightWorkHours: 20,
    paidLeaveUsed: 3,
    paidLeaveRemaining: 17,
    absentDays: 1,
  },
  // 他の従業員も追加していきます
];

// 10月のダミーデータ
export const OCTOBER_ATTENDANCE_DUMMY: {
  [userId: string]: DailyAttendanceData[];
} = {
  "1": [
    // ReoNa
    {
      date: "2025-10-01",
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      calculationStart: "09:00",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-02",
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      calculationStart: "09:00",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-03",
      workType: "paid",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-04",
      workType: "day_off",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-05",
      workType: "day_off",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
  ],
  "2": [
    // Aimer
    {
      date: "2025-10-01",
      workType: "night_working",
      workStart: "21:00",
      workStartType: "on_time",
      calculationStart: "21:00",
      workEnd: "06:00",
      workEndType: "on_time",
      restStart: "00:00",
      restEnd: "01:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-02",
      workType: "absenteeism",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
    {
      date: "2025-10-03",
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      calculationStart: "09:00",
      workEnd: "20:00",
      workEndType: "over_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 120,
    },
  ],
};

export const SEPTEMBER_ATTENDANCE_DUMMY: { [userId: string]: DailyAttendanceData[] } = {
  "1": [ // ReoNa
    {
      date: "2025-09-01",
      workType: "day_working",
      workStart: "09:15",
      workStartType: "late",  // 遅刻
      calculationStart: "09:15",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-09-02",
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      calculationStart: "09:00",
      workEnd: "17:30",
      workEndType: "early_leave",  // 早退
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-09-03",
      workType: "day_working",
      workStart: "08:45",
      workStartType: "early_arrival",  // 早出
      calculationStart: "09:00",
      workEnd: "19:00",
      workEndType: "over_time",  // 残業
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 60,
    },
    {
      date: "2025-09-04",
      workType: "paid",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
    {
      date: "2025-09-05",
      workType: "day_working",
      workStart: "09:30",
      workStartType: "late",  // 遅刻
      calculationStart: "09:30",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
  ],
  "2": [ // Aimer
    {
      date: "2025-09-01",
      workType: "night_working",
      workStart: "20:45",
      workStartType: "early_arrival",
      calculationStart: "21:00",
      workEnd: "06:30",
      workEndType: "over_time",
      restStart: "00:00",
      restEnd: "01:00",
      overtimeMinutes: 30,
    },
    {
      date: "2025-09-02",
      workType: "day_working",
      workStart: "09:20",
      workStartType: "late",  // 遅刻
      calculationStart: "09:20",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      date: "2025-09-03",
      workType: "absenteeism",
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
    {
      date: "2025-09-04",
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      calculationStart: "09:00",
      workEnd: "22:00",
      workEndType: "over_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 240,  // 4時間残業
    },
    {
      date: "2025-09-05",
      workType: "paid_pending",  // 申請中の有給
      workStart: "",
      workStartType: null,
      calculationStart: "",
      workEnd: "",
      workEndType: null,
      restStart: "",
      restEnd: "",
      overtimeMinutes: 0,
    },
  ],
};

type AttendanceByMonth = Record<string, DailyAttendanceData[]>
type AttendanceByUser = Record<string, AttendanceByMonth>

export const ATTENDANCE_DUMMY_BY_MONTH: AttendanceByUser = {
  "1": {
    "2025-09": SEPTEMBER_ATTENDANCE_DUMMY["1"],
    "2025-10": OCTOBER_ATTENDANCE_DUMMY["1"],
  },
  "2": {
    "2025-09": SEPTEMBER_ATTENDANCE_DUMMY["2"],
    "2025-10": OCTOBER_ATTENDANCE_DUMMY["2"],
  },
}