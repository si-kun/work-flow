import { Card, CardContent } from "@/components/ui/card";
import { DailyAttendanceData } from "@/types/attendance";
import { minutesToTime } from "@/utils/timeUtils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import EditTimeCard from "./EditTimeCard";

interface AttendanceCardProps {
  todayAttendance?: DailyAttendanceData | null;
  selectedAttendance?: DailyAttendanceData;
  selectedDate?: Date;
}

interface AttendanceSectionProps {
  data?: DailyAttendanceData;
  mode: "edit" | "register";
  selectedDate?: Date;
}

export const attendanceFields: {
  label: string;
  key: keyof DailyAttendanceData;
}[] = [
  { label: "日付", key: "date" },
  { label: "出勤", key: "workStart" },
  { label: "退勤", key: "workEnd" },
  { label: "休憩開始", key: "restStart" },
  { label: "休憩終了", key: "restEnd" },
  { label: "残業", key: "overtimeMinutes" },
];

const AttendanceSection = ({
  data,
  mode,
  selectedDate,
}: AttendanceSectionProps) => {
  const formatDisplayValue = <K extends keyof DailyAttendanceData>(
    key: K,
    value: DailyAttendanceData[K] | undefined
  ) => {
    // 日付の場合
    if (key === "date") {
      if (!value && selectedDate) {
        return format(selectedDate, "yyyy/MM/dd (EEE)", { locale: ja });
      }
      if (!value) return "選択されていません";

      const date = value instanceof Date ? value : new Date(value);
      return format(date, "yyyy/MM/dd (EEE)", { locale: ja });
    }

    // その他のフィールド
    if (!value) {
      return "--:--";
    }

    // 残業の場合
    if (key === "overtimeMinutes" && typeof value === "number") {
      return minutesToTime(value);
    }

    return String(value);
  };

  const getBadgeInfo = (
    key: keyof DailyAttendanceData,
    data?: DailyAttendanceData
  ) => {
    if (!data) return null;

    // workStartの場合
    if (key === "workStart") {
      if (data.workStartType === "early_arrival") {
        return { text: "(早出)", color: "text-green-500" };
      }
      if (data.workStartType === "late") {
        return { text: "(遅刻)", color: "text-red-500" };
      }
    }

    // workEndの場合
    if (key === "workEnd" && data.workEndType === "early_leave") {
      return { text: "(早退)", color: "text-red-500" };
    }
    return null;
  };

  return (
    <Card className="w-[250px] flex flex-col gap-2 px-4">
      <CardContent className="flex flex-col gap-2 px-0">
        {attendanceFields.map(({ label, key }) => {
          const value = data?.[key];
          const displayValue = formatDisplayValue(key, value);
          const badge = getBadgeInfo(key, data);

          return (
            <div key={key}>
              <span>
                {label}:{displayValue}
              </span>
              {badge && (
                <span className={`${badge.color} text-xs font-bold`}>
                  {badge.text}
                </span>
              )}
            </div>
          );
        })}
      </CardContent>
      <EditTimeCard data={data} mode={mode} selectedDate={selectedDate} />
    </Card>
  );
};

const AttendanceCard = ({
  todayAttendance,
  selectedAttendance,
  selectedDate,
}: AttendanceCardProps) => {
  const data = todayAttendance || selectedAttendance;
  const mode = data ? "edit" : "register";

  return (
    <AttendanceSection data={data} mode={mode} selectedDate={selectedDate} />
  );
};

export default AttendanceCard;
