interface ShiftSettings {
  start: string;
  end: string;
  earlyClockInWindow: number;
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
