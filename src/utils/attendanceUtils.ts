import { SHIFT_SETTINGS } from "@/constants/attendance";
import { timeToMinutes } from "./timeUtils";

export type ClockInType = "early_arrival" | "on_time" | "late";

export const determineClockInType = (
  clickTime: string,
  shiftType: keyof typeof SHIFT_SETTINGS
): {
  type: ClockInType;
  calculationTime: string;
} => {
  const settings = SHIFT_SETTINGS[shiftType];
  const clickMinutes = timeToMinutes(clickTime);
  const scheduledMinutes = timeToMinutes(settings.start);
  const windowStartMinutes = scheduledMinutes - settings.earlyClockInWindow;

  if (clickMinutes < windowStartMinutes) {
    // 早出(30分より前)
    return {
      type: "early_arrival",
      calculationTime: clickTime,
    };
  } else if (clickMinutes < scheduledMinutes) {
    // 通常出勤(30分前~定時前)
    return {
      type: "on_time",
      calculationTime: settings.start,
    };
  } else {
    // 遅刻(定時より後)
    return {
      type: "late",
      calculationTime: clickTime,
    };
  }
};
