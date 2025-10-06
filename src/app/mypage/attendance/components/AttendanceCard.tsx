import { Card, CardContent } from "@/components/ui/card";
import { AttendanceData } from "@/types/attendance";
import { minutesToTime } from "@/utils/timeUtils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface AttendanceCardProps {
  todayAttendance: AttendanceData;
  selectedAttendance?: AttendanceData;
}

const attendanceFields: { label: string; key: keyof AttendanceData }[] = [
  { label: "日付", key: "date" },
  { label: "出勤", key: "workStart" },
  { label: "退勤", key: "workEnd" },
  { label: "休憩開始", key: "restStart" },
  { label: "休憩終了", key: "restEnd" },
  { label: "残業", key: "overtimeMinutes" },
];

const AttendanceSection = ({ data }: { data?: AttendanceData }) => (
  <Card className="w-[200px] flex flex-col gap-2">
    <CardContent className="flex flex-col gap-2">
      {attendanceFields.map(({ label, key }) => {
        const value = data ? (data[key] || (key === "date" ? "未設定" : "--:--")) : "--:--";

        if(key === "date") {
          console.log("日付の値:", value, "型:", typeof value);
        }
        let displayValue = value;

        if(key === "date" && typeof value === "string" && value !== "--:--" && value !== "未設定") {
          displayValue = format(new Date(value), "yyyy/MM/dd (EEE)", { locale: ja});
        } else if(key === "overtimeMinutes" && typeof value === "number") {
          displayValue = minutesToTime(value);
        }

        return (
          <div key={key}>
            <span>{label}:{displayValue}</span>
            {key==="workStart" && data?.workStartType === "early_arrival" && (
              <span className="text-green-500 text-xs font-bold">(早出)</span>
            )}
            {key ==="workStart" && data?.workStartType === "late" && (
              <span className="text-red-500 text-xs font-bold">(遅刻)</span>
            )}
            {key ==="workEnd" && data?.workEndType === "early_leave" && (
              <span className="text-red-500 text-xs font-bold">(早退)</span>
            )}
            {/* {key === "overtimeMinutes" && typeof value === "number" && value > 0 && (
              <span>({minutesToTime(value)})</span>
            )} */}
          </div>
        );
      })}
    </CardContent>
  </Card>
);

const AttendanceCard = ({
  todayAttendance,
  selectedAttendance,
}: AttendanceCardProps) => {
  return <AttendanceSection data={todayAttendance || selectedAttendance} />;
};

export default AttendanceCard;
