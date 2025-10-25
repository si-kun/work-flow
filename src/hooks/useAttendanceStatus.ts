import { DailyAttendanceData } from "@/types/attendance";

export const useAttendanceStatus = (todayAttendance: DailyAttendanceData | null) => {
  const canClockIn = () => {
    if (!todayAttendance) return true;

    const isWorking = !todayAttendance.workStart && !todayAttendance.workEnd;
    return isWorking;
  };
  // 休憩可能かどうか
  const canStartBreak = () => {
    if (!todayAttendance) return false;

    const isWorking = todayAttendance.workStart && !todayAttendance.workEnd;
    const hasNotStartedBreak = !todayAttendance.restStart;

    return isWorking && hasNotStartedBreak;
  };

  // 退勤可能かどうか
  const canClockOut = () => {
    if (!todayAttendance) return false;

    return todayAttendance.workStart && !todayAttendance.workEnd;
  };

  // 現在の状態（表示用）
  const getCurrentStatus = () => {
    if (!todayAttendance || todayAttendance.workEnd) {
      return "退勤中";
    }

    if (todayAttendance.restStart && !todayAttendance.restEnd) {
      return "休憩中";
    }

    if (
      todayAttendance.workStart &&
      todayAttendance.workType === "night_working"
    ) {
      return "夜勤中";
    }

    if (
      todayAttendance.workStart &&
      todayAttendance.workType === "day_working"
    ) {
      return "勤務中";
    }
    return "退勤中";
  };
  // 現在のステータスによってカラーを変える
  const getCurrentStatusColor = () => {
    const status = getCurrentStatus();

    switch (status) {
      case "勤務中":
        return "bg-green-300 text-black";
      case "夜勤中":
        return "bg-purple-300 text-black";
      case "休憩中":
        return "bg-orange-300 text-black";
      case "退勤中":
        return "bg-red-300 text-white";
    }
  };

  return {
    canClockIn,
    canStartBreak,
    canClockOut,
    getCurrentStatus,
    getCurrentStatusColor,
  };
};
