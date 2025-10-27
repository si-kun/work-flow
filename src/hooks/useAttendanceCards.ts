import { AttendanceCardData, MonthlyStatistics } from "@/types/attendance";
import { minutesToTime } from "@/utils/timeUtils";
import { useState } from "react";

export const useAttendanceCards = () => {
  const [stats, setStats] = useState<MonthlyStatistics>({
    paidLeaveDays: 0,
    acquiredPaidLeaveDays: 0,
    workingMinutes: 0,
    nightShiftMinutes: 0,
    overtimeMinutes: 0,
    absentDays: 0,
  });

  const {
    paidLeaveDays,
    acquiredPaidLeaveDays,
    workingMinutes,
    nightShiftMinutes,
    overtimeMinutes,
    absentDays,
  } = stats;

  const ATTENDANCE_CARDS = [
    {
      title: "残りの有給日数",
      value: acquiredPaidLeaveDays - paidLeaveDays,
      unit: "日",
    },
    {
      title: "申請中の有給日数",
      value: 0,
      unit: "日",
    },
    {
      title: "今月の有給日数",
      value: paidLeaveDays,
      unit: "日",
    },

    {
      title: "労働時間",
      value: workingMinutes,
      unit: "時間",
      displayValue: `${minutesToTime(workingMinutes)} (夜勤:${minutesToTime(
        nightShiftMinutes
      )})`,
    },
    {
      title: "残業時間",
      value: overtimeMinutes,
      unit: "時間",
      displayValue: minutesToTime(overtimeMinutes),
    },
    {
      title: "欠勤日数",
      value: absentDays,
      unit: "日",
    },
  ] as AttendanceCardData[];

  return {
    stats,
    setStats,
    ATTENDANCE_CARDS,
  };
};
