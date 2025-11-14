"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { DEPARTMENTS } from "@/constants/employee";
import { minutesToTime } from "@/utils/timeUtils";
import DepartmentDetailModal from "./DepartmentDetailModal";
import { useState } from "react";
import { useAttendanceData } from "@/hooks/attendance/useAttendanceData";

interface OvertimeData {
  department: string;
  overtime: number;
}

interface OvertimePieChartProps {
  data: OvertimeData[];
  year: number;
  month: number;
}

const chartConfig = {
  overtime: {
    label: "残業時間",
  },
} satisfies ChartConfig;

export default function OvertimePieChart({
  data,
  year,
  month,
}: OvertimePieChartProps) {

  const [targetDepartment, setTargetDepartment] = useState<string | null>(null);
  const [pieClickOpen, setPieClickOpen] = useState(false);

  const {attendanceData} = useAttendanceData({ year, month });
  const filteredUser = attendanceData.filter((user) => user.department === targetDepartment);

  const handleDepartmentClick = (department: string) => {
    setTargetDepartment(department);
    setPieClickOpen(true);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>部署別平均残業時間</CardTitle>
        <CardDescription>
          今月の部署ごとの平均残業時間(円グラフ)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="overtime"
              nameKey="department"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="var(--color-overtime)"
              label={({ department, overtime }) =>
                `${convertToJapanese(department, DEPARTMENTS)} ${minutesToTime(
                  overtime
                )}`
              }
              onClick={(data) => handleDepartmentClick(data.department)}
            />
          </PieChart>
        </ChartContainer>
        {/* 対象の従業員一覧のモーダルを開く */}
        <DepartmentDetailModal isOpen={pieClickOpen} setIsOpen={setPieClickOpen} user={filteredUser} />
      </CardContent>
    </Card>
  );
}
