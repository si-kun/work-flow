import {
  ClockInType,
  ClockOutType,
  DailyAttendanceData,
  DailyWorkType,
} from "@/types/attendance";
import { timeToMinutes } from "./timeUtils";
import { SHIFT_SETTINGS } from "@/constants/attendance";

// 夜勤の時間を計算 (22時〜翌5時 20時出勤～6時退勤の場合)
const calcNightShiftMinutes = (
  clockInMinutes: number,
  clockOutMinutes: number
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

// 休憩時間の計算
const calcBreakMinutes = (restStart: string, restEnd: string): number => {
  if (!restStart || !restEnd) return 0;

  const startMinutes = timeToMinutes(restStart);
  const endMinutes = timeToMinutes(restEnd);

  return endMinutes - startMinutes;
};

export type WorkShiftType = "day_working" | "night_working";

export const calcWorkAndOvertime = (
  type: DailyWorkType,
  extendProps: DailyAttendanceData
): {
  workMinutes: number;
  overtimeMinutes: number;
  nightShiftMinutes: number;
  workStartType: ClockInType | null;
  workEndType: ClockOutType | null;
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
      workStartType: null,
      workEndType: null,
    };
  }

  // ステップ2: workStart がない場合
  if (!extendProps.workStart) {
    return {
      workMinutes: 0,
      overtimeMinutes: 0,
      nightShiftMinutes: 0,
      workStartType: null,
      workEndType: null,
    };
  }

  // ステップ3: 出勤タイプを判定
  const workStartType = calcClockInType(
    extendProps.workType,
    extendProps.workStart
  );

  // ステップ4: workEnd がない場合(出勤のみ)
  if (!extendProps.workEnd) {
    return {
      workMinutes: 0,
      overtimeMinutes: 0,
      nightShiftMinutes: 0,
      workStartType,
      workEndType: null,
    };
  }

  // ステップ5: 退勤タイプを判定
  const workEndType = calcClockOutType(
    extendProps.workType,
    extendProps.workStart,
    extendProps.workEnd
  );

  // ここから既存のロジック(労働時間計算)
  const clockInMinutes = timeToMinutes(extendProps.workStart);
  let clockOutMinutes = timeToMinutes(extendProps.workEnd);
  const breakTime = calcBreakMinutes(
    extendProps.restStart || "",
    extendProps.restEnd || ""
  );

  // 日付またぎ対応
  if (clockOutMinutes < clockInMinutes) {
    clockOutMinutes += 1440;
  }

  const workMinutes = clockOutMinutes - clockInMinutes - breakTime;
  const nightShiftMinutes = calcNightShiftMinutes(clockInMinutes, clockOutMinutes);

  // シフト設定を取得
  const ShiftSettings =
    type === "day_working"
      ? SHIFT_SETTINGS.day_working
      : SHIFT_SETTINGS.night_working;
  let shiftEndMinutes = timeToMinutes(ShiftSettings.end);
  
  // 定時も日付またぎ対応
  if (shiftEndMinutes < clockInMinutes) {
    shiftEndMinutes += 1440;
  }

  // 残業を共通化
  const regularMinutes = shiftEndMinutes - clockInMinutes - breakTime
  const overtimeMinutes = workMinutes > regularMinutes ? workMinutes - regularMinutes : 0;
  
  return {
    workMinutes,
    overtimeMinutes,
    nightShiftMinutes,
    workStartType,
    workEndType,
  };
};

// 出勤タイプを判定する
export const calcClockInType = (
  workType: "day_working" | "night_working",
  workStart: string
): ClockInType => {
  const clockInMinutes = timeToMinutes(workStart);
  const shiftSettings = SHIFT_SETTINGS[workType];
  const shiftStartMinutes = timeToMinutes(shiftSettings.start);

  // 早出の判定範囲（30分)
  const earlyWindowStart = shiftStartMinutes - shiftSettings.earlyClockInWindow;

  if (clockInMinutes < earlyWindowStart) {
    return "early_arrival";
  } else if (clockInMinutes <= shiftStartMinutes) {
    return "on_time";
  } else {
    return "late";
  }
};

// 退勤タイプを判定
export const calcClockOutType = (
  workType: "day_working" | "night_working",
  workStart: string,
  workEnd: string
): ClockOutType => {
  const clockInMinutes = timeToMinutes(workStart);
  let clockOutMinutes = timeToMinutes(workEnd);
  const shiftSettings = SHIFT_SETTINGS[workType];
  let shiftEndMinutes = timeToMinutes(shiftSettings.end);

  // 日付またぎの処理
  if (clockOutMinutes < clockInMinutes) {
    clockOutMinutes += 1440;
  }
  if(shiftEndMinutes < clockInMinutes) {
    shiftEndMinutes += 1440;
  }

  if(clockOutMinutes < shiftEndMinutes) {
    return "early_leave";
  } else if (clockOutMinutes === shiftEndMinutes) {
    return "on_time";
  } else {
    return "over_time";
  }
};
