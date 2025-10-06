export type CurrentWorkStatus = "day_working" | "night_working" | "rest" | "leave";

export type DailyWorkType =
| "day_working"     // 通常勤務
| "night_working"   // 夜勤
| "paid"            // 有給休暇
| "paid_pending"    // 申請中の有給
| "absenteeism"     // 欠勤
| "day_off";        // 休日


export type ClockInType= "early_arrival" | "on_time" | "late";
export type ClockOutType= "early_leave" | "on_time" | "over_time";

export interface AttendanceData  {
    date: string;
    workType: DailyWorkType | null;
    workStart: string;
    workStartType: ClockInType | null;
    calculationStart: string;
    workEnd: string;
    workEndType: ClockOutType | null;
    restStart: string;
    restEnd: string;
    overtimeMinutes: number;
}

export interface CalendarEvent {
    title: string;
    start: string;
    end: string;
    extendedProps: AttendanceData ;
}