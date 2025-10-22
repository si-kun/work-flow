import { ClockInType, ClockOutType, DailyAttendanceData } from "@/types/attendance";
import { minutesToTime, timeToMinutes } from "./timeUtils";
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

export const calcWorkAndOvertime = (
  type: string,
  extendProps: DailyAttendanceData
): {
  workMinutes: number;
  overtimeMinutes: number;
  nightShiftMinutes: number;
  nightShiftDisplay: string;
  workDisplay: string;
  overtimeDisplay: string;
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
      nightShiftDisplay: "",
      workDisplay: "",
      overtimeDisplay: "",
      workStartType: null,
      workEndType: null,
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
      workStartType: null,
      workEndType: null,
    };
  }

  // 基本的な計算
  const clockInMinutes = timeToMinutes(extendProps.workStart);
  let clockOutMinutes = timeToMinutes(extendProps.workEnd);
  const breakTime = calcBreakMinutes(
    extendProps.restStart || "",
    extendProps.restEnd || ""
  );

  // シフト設定を取得
  const ShiftSettings =
    type === "day_working"
      ? SHIFT_SETTINGS.day_working
      : SHIFT_SETTINGS.night_working;
  const shiftStartMinutes = timeToMinutes(ShiftSettings.start);
  const shiftEndMinutes = timeToMinutes(ShiftSettings.end);

  //出勤タイプを判定
  let workStartType: ClockInType;
  if (clockInMinutes < shiftStartMinutes) {
    workStartType = "early_arrival";
  } else if (clockInMinutes === shiftStartMinutes) {
    workStartType = "on_time";
  } else {
    workStartType = "late";
  }

  // 退勤タイプを判定 (日付またぎも考慮)
  let adjustedClockOutMinutes = clockOutMinutes;
  let adjustedShiftEndMinutes = shiftEndMinutes;

  if (clockOutMinutes < clockInMinutes) {
    // 退勤時間より出勤時間が大きい場合、日付またぎ
    adjustedClockOutMinutes += 1440; // 24時間分を加算
  }
  if (shiftEndMinutes < clockInMinutes) {
    // 定時より出勤時間が大きい場合、日付またぎ
    adjustedShiftEndMinutes += 1440; // 24時間分を加算
  }

  let workEndType: ClockOutType;
  if (adjustedClockOutMinutes < adjustedShiftEndMinutes) {
    workEndType = "early_leave";
  } else if (adjustedClockOutMinutes === adjustedShiftEndMinutes) {
    workEndType = "on_time";
  } else {
    workEndType = "over_time";
  }


  // 労働時間を計算
  clockOutMinutes = adjustedClockOutMinutes;
  const workMinutes = clockOutMinutes - clockInMinutes - breakTime;

  // ステップ4: 夜勤時間を計算(常に計算する)
  const nightShiftMinutes = calcNightShiftMinutes(
    clockInMinutes,
    clockOutMinutes
  );

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
      workStartType,
      workEndType,
    };
  }

  // 残業時間を計算
  const regularMinutes = adjustedShiftEndMinutes - clockInMinutes - breakTime;

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
    overtimeDisplay: overtimeMinutes > 0 ? minutesToTime(overtimeMinutes) : "",
    workStartType,
    workEndType,
  };
};
