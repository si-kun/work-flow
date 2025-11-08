import { DailyWorkType } from "@/types/attendance";

interface EventColors {
  bgColor: string;
  textColor: string;
}

export type ShiftType = Extract<
  DailyWorkType,
  "day_working" | "night_working" | "paid" | "day_off"
>;

export interface ShiftSettingEvent {
    title: string;
    start: string;
    end: string;
    allDay: boolean;
}

export const EVENT_COLORS: Record<DailyWorkType, EventColors> = {
  day_working: {
    bgColor: "bg-green-500",
    textColor: "text-white",
  },
  night_working: { bgColor: "bg-purple-600", textColor: "text-white" },
  paid: { bgColor: "bg-yellow-400", textColor: "text-black" },
  paid_pending: { bgColor: "bg-yellow-200", textColor: "text-black" },
  absenteeism: { bgColor: "bg-red-600", textColor: "text-white" },
  day_off: { bgColor: "bg-gray-400", textColor: "text-black" },
} as const;

export const EVENT_COLORS_BUTTON = {
  day_working: {
    className: "bg-green-500 hover:bg-green-400 text-black",
  },
  night_working: {
    className: "bg-purple-600 hover:bg-purple-500 text-white hover:text-white",
  },
  paid: {
    className: "bg-yellow-400 hover:bg-yellow-300 text-black",
  },
  day_off: {
    className: "bg-gray-400 hover:bg-gray-300 text-black",
  },
} as const;
